// ═══════════════════════════════════════════════════════════════
// StatusVault — Native Deep Link Handler (v3 — robust)
// ───────────────────────────────────────────────────────────────
// Catches statusvault://auth?... callbacks and feeds tokens into
// Supabase. Built defensively because the cold-start path is racy:
// iOS delivers the URL before AsyncStorage and Supabase's auth
// store have finished hydrating. We retry once if the first
// attempt fails, and we verify the session actually landed.
// ═══════════════════════════════════════════════════════════════

import { Linking, Platform } from 'react-native';
import { supabase } from './supabase';

/**
 * Sleep helper for retry delays.
 */
const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

/**
 * Verify a session exists after an auth operation. Returns true if
 * Supabase has a valid session in storage. Used as a sanity check.
 */
async function hasSession(): Promise<boolean> {
  try {
    const { data } = await supabase.auth.getSession();
    return !!data?.session?.user;
  } catch {
    return false;
  }
}

/**
 * Try a PKCE code exchange. If the first attempt fails (often a
 * race on cold start), wait briefly and retry once.
 */
async function exchangeCodeWithRetry(code: string): Promise<{ ok: boolean; error?: string }> {
  for (let attempt = 1; attempt <= 2; attempt++) {
    console.log(`[deepLink] exchangeCodeForSession attempt ${attempt}/2`);
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        console.log('[deepLink] exchangeCodeForSession returned without error');
        // Verify session actually landed
        const ok = await hasSession();
        if (ok) {
          console.log('[deepLink] session verified ✓');
          return { ok: true };
        }
        console.warn('[deepLink] exchange returned no error but no session in storage');
      } else {
        console.warn(`[deepLink] exchange attempt ${attempt} error:`, error.message);
      }
    } catch (e: any) {
      console.warn(`[deepLink] exchange attempt ${attempt} threw:`, e?.message ?? e);
    }
    if (attempt === 1) {
      console.log('[deepLink] waiting 500ms before retry...');
      await sleep(500);
    }
  }
  return { ok: false, error: 'Code exchange failed after 2 attempts. Code verifier may be missing from storage.' };
}

/**
 * Try setSession with retry semantics for implicit flow.
 */
async function setSessionWithRetry(accessToken: string, refreshToken: string): Promise<{ ok: boolean; error?: string }> {
  for (let attempt = 1; attempt <= 2; attempt++) {
    console.log(`[deepLink] setSession attempt ${attempt}/2`);
    try {
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (!error) {
        const ok = await hasSession();
        if (ok) {
          console.log('[deepLink] session verified ✓');
          return { ok: true };
        }
      } else {
        console.warn(`[deepLink] setSession attempt ${attempt} error:`, error.message);
      }
    } catch (e: any) {
      console.warn(`[deepLink] setSession attempt ${attempt} threw:`, e?.message ?? e);
    }
    if (attempt === 1) await sleep(500);
  }
  return { ok: false, error: 'setSession failed after 2 attempts.' };
}

/**
 * Parse a statusvault:// auth URL and complete the Supabase session.
 */
async function handleAuthUrl(url: string): Promise<boolean> {
  console.log('[deepLink] received URL:', url);

  if (!url || !url.includes('://auth')) {
    console.log('[deepLink] URL does not match ://auth pattern, ignoring');
    return false;
  }

  // Defensive delay — give Supabase's auth storage a moment to hydrate
  // on cold start before we try to use it. Negligible cost on warm start.
  await sleep(150);

  try {
    // Build the full set of params from BOTH ?query and #hash portions.
    // Supabase sometimes uses one, sometimes the other, sometimes both.
    const allParams = new URLSearchParams();
    const queryIndex = url.indexOf('?');
    const hashIndex = url.indexOf('#');

    if (queryIndex !== -1) {
      // Query ends at # if present, otherwise at end of string
      const queryEnd = hashIndex !== -1 && hashIndex > queryIndex ? hashIndex : url.length;
      const queryString = url.substring(queryIndex + 1, queryEnd);
      new URLSearchParams(queryString).forEach((v, k) => allParams.set(k, v));
    }
    if (hashIndex !== -1) {
      // Everything after # — hash params have priority over query for tokens
      const hashEnd = queryIndex !== -1 && queryIndex > hashIndex ? queryIndex : url.length;
      const hashString = url.substring(hashIndex + 1, hashEnd);
      new URLSearchParams(hashString).forEach((v, k) => allParams.set(k, v));
    }

    if (allParams.toString() === '') {
      console.log('[deepLink] URL has no params');
      return false;
    }

    // Surface any error params that Supabase included (e.g., expired code)
    const errorCode = allParams.get('error');
    const errorDesc = allParams.get('error_description');
    if (errorCode) {
      console.warn(`[deepLink] auth callback contained error: ${errorCode} — ${errorDesc}`);
      // Don't abort — fall through, sometimes Supabase includes both an error and tokens
    }

    // ─── Path 1: Implicit flow (#access_token + #refresh_token) ────────
    const accessToken  = allParams.get('access_token');
    const refreshToken = allParams.get('refresh_token');
    if (accessToken && refreshToken) {
      console.log('[deepLink] handling implicit flow');
      const result = await setSessionWithRetry(accessToken, refreshToken);
      if (!result.ok) console.warn('[deepLink] implicit flow failed:', result.error);
      return true;
    }

    // ─── Path 2: PKCE flow (?code=) ────────────────────────────────────
    const code = allParams.get('code');
    if (code) {
      console.log('[deepLink] handling PKCE flow with code:', code.substring(0, 8) + '...');
      const result = await exchangeCodeWithRetry(code);
      if (!result.ok) console.warn('[deepLink] PKCE flow failed:', result.error);
      return true;
    }

    // ─── Path 3: Legacy OTP token_hash ─────────────────────────────────
    const tokenHash = allParams.get('token_hash');
    const type      = allParams.get('type');
    if (tokenHash && (type === 'signup' || type === 'email' || type === 'magiclink' || type === 'recovery')) {
      console.log('[deepLink] handling legacy OTP flow');
      const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: type as any });
      if (error) console.warn('[deepLink] verifyOtp failed:', error.message);
      else console.log('[deepLink] verifyOtp succeeded');
      return true;
    }

    console.log('[deepLink] URL had no recognizable auth params:', Array.from(allParams.keys()).join(', '));
    return true;
  } catch (e: any) {
    console.warn('[deepLink] handler threw:', e?.message ?? e);
    return false;
  }
}

/**
 * Wire up deep-link listeners. Call this once from App.tsx.
 */
export function registerDeepLinkHandler(): () => void {
  if (Platform.OS === 'web') return () => {};

  console.log('[deepLink] registering listeners');

  // Cold start — URL was queued before app launched
  Linking.getInitialURL().then((url) => {
    if (url) {
      console.log('[deepLink] cold start with initial URL');
      handleAuthUrl(url);
    } else {
      console.log('[deepLink] cold start with no initial URL (normal launch)');
    }
  }).catch((e) => {
    console.warn('[deepLink] getInitialURL failed:', e?.message ?? e);
  });

  // Warm start — URL arrives while app is running
  const sub = Linking.addEventListener('url', ({ url }) => {
    console.log('[deepLink] warm event received');
    handleAuthUrl(url);
  });

  return () => {
    try { sub.remove(); } catch {}
  };
}
