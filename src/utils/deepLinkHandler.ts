// ═══════════════════════════════════════════════════════════════
// StatusVault — Native Deep Link Handler
// ───────────────────────────────────────────────────────────────
// On iOS/Android, magic-link emails and Google OAuth callbacks
// open URLs of the form:
//
//   statusvault://auth#access_token=...&refresh_token=...   (implicit)
//   statusvault://auth?code=xxx                             (PKCE)
//   statusvault://auth?token_hash=xxx&type=magiclink        (legacy OTP)
//
// iOS routes these to the app because `app.json` declares the
// `statusvault` URL scheme. But the app must explicitly catch them
// and feed the tokens into Supabase. That's what this module does.
//
// Without this handler, the URL would open the app but auth state
// would remain "not signed in" — exactly the bug the user reported.
// ═══════════════════════════════════════════════════════════════

import { Linking, Platform } from 'react-native';
import { supabase } from './supabase';

/**
 * Parse a statusvault:// auth URL and complete the Supabase session.
 * Safe to call on web — it's a no-op there because `detectSessionInUrl`
 * already handles browser URLs.
 *
 * Returns `true` if the URL was an auth callback (regardless of success),
 * so callers can know whether to suppress duplicate handling.
 */
async function handleAuthUrl(url: string): Promise<boolean> {
  // Log every incoming URL so the developer can see (in Xcode/Expo console)
  // whether the deep link ever arrives at all. If you see this line in logs,
  // iOS is correctly routing the URL to the app — any auth failure after this
  // is a token-parsing or Supabase issue, not a deep-link issue.
  console.log('[deepLink] received URL:', url);

  if (!url || !url.includes('://auth')) {
    console.log('[deepLink] URL does not match ://auth pattern, ignoring');
    return false;
  }

  try {
    // Split the URL into base + query/hash params. RN's URL constructor
    // is sometimes flaky on custom schemes, so do it manually.
    const hashIndex = url.indexOf('#');
    const queryIndex = url.indexOf('?');

    let paramString = '';
    if (hashIndex !== -1)  paramString = url.substring(hashIndex + 1);
    else if (queryIndex !== -1) paramString = url.substring(queryIndex + 1);

    if (!paramString) return false;

    const params = new URLSearchParams(paramString);

    // ─── Path 1: Implicit flow (most common for magic links) ──────────
    // URL contains #access_token=... — call setSession directly.
    const accessToken  = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    if (accessToken && refreshToken) {
      console.log('[deepLink] handling implicit flow (access_token + refresh_token)');
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (error) console.warn('[deepLink] setSession failed:', error.message);
      else console.log('[deepLink] setSession succeeded');
      return true;
    }

    // ─── Path 2: PKCE flow (for OAuth / newer Supabase setups) ─────────
    // URL contains ?code=xxx — exchange for a session.
    const code = params.get('code');
    if (code) {
      console.log('[deepLink] handling PKCE flow (code exchange)');
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) console.warn('[deepLink] exchangeCodeForSession failed:', error.message);
      else console.log('[deepLink] exchangeCodeForSession succeeded');
      return true;
    }

    // ─── Path 3: Legacy OTP token_hash (older email link format) ───────
    const tokenHash = params.get('token_hash');
    const type      = params.get('type');
    if (tokenHash && (type === 'signup' || type === 'email' || type === 'magiclink' || type === 'recovery')) {
      console.log('[deepLink] handling legacy OTP flow (token_hash)');
      const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: type as any });
      if (error) console.warn('[deepLink] verifyOtp failed:', error.message);
      else console.log('[deepLink] verifyOtp succeeded');
      return true;
    }

    console.log('[deepLink] URL had no recognizable auth params');

    // URL pointed to /auth but had no recognizable params — likely a
    // malformed redirect. Return true so we don't bounce on it.
    return true;
  } catch (e: any) {
    console.warn('[deepLink] handler threw:', e?.message ?? e);
    return false;
  }
}

/**
 * Wire up deep-link listeners. Call this once from App.tsx.
 *
 * Returns a cleanup function that removes the listener — store it and
 * call on unmount to avoid leaks.
 */
export function registerDeepLinkHandler(): () => void {
  if (Platform.OS === 'web') return () => {};

  // Case A — app opened cold from a magic link tap (URL was queued at launch)
  Linking.getInitialURL().then((url) => {
    if (url) handleAuthUrl(url);
  }).catch(() => {});

  // Case B — app already running and link tapped (URL arrives via event)
  const sub = Linking.addEventListener('url', ({ url }) => {
    handleAuthUrl(url);
  });

  return () => {
    try { sub.remove(); } catch {}
  };
}
