// ═══════════════════════════════════════════════════════════════
// StatusVault — Auth Desync Banner
// ───────────────────────────────────────────────────────────────
// Polls Supabase every 3 seconds and compares it to what the
// store thinks. If they disagree, shows a diagnostic banner so
// the user (and we) can see this exact failure mode.
//
// This catches the bug pattern: user signs in via Google/email,
// Supabase thinks they're authenticated, but the store's authUser
// is null so the app shows them as signed out.
// ═══════════════════════════════════════════════════════════════

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store';
import { supabase } from '../utils/supabase';
import { dlog, dwarn } from '../utils/debugLog';

interface Props {
  onOpenDebug: () => void;
}

export const AuthDesyncBanner: React.FC<Props> = ({ onOpenDebug }) => {
  const authUser = useStore(s => s.authUser);
  const [supabaseEmail, setSupabaseEmail] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [autoFixAttempted, setAutoFixAttempted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;
        const sbEmail = data?.session?.user?.email ?? null;
        const sbUser  = data?.session?.user;
        const storeAuth = useStore.getState().authUser;

        // AUTO-FIX: if Supabase has a session but the store doesn't, try to fix
        // it silently first. This catches the cold-start race condition where
        // Supabase's AsyncStorage hydration finishes after our initAuth retries
        // give up. Most users will never see the warning banner because of this.
        if (sbUser && !storeAuth && !autoFixAttempted) {
          dlog('[desync-banner] auto-fix: setting authUser from Supabase session');
          useStore.setState({
            authUser: {
              id: sbUser.id,
              email: sbUser.email!,
              createdAt: sbUser.created_at,
            },
            isGuestMode: false,
            hasOnboarded: true,
            showWelcomeModal: false,
          });
          setAutoFixAttempted(true);
          // Don't set checked yet — give the store a moment to update so the
          // next render sees authUser !== null and we never show the banner
          setTimeout(() => {
            if (!cancelled) { setSupabaseEmail(sbEmail); setChecked(true); }
          }, 200);
          return;
        }

        setSupabaseEmail(sbEmail);
        setChecked(true);
      } catch {
        if (cancelled) return;
        setSupabaseEmail(null);
        setChecked(true);
      }
    };
    // Wait 5 seconds before the first check. This gives the cold-start
    // hydration path (Supabase AsyncStorage + initAuth polling retry) time
    // to complete normally without the banner ever appearing.
    const initialDelay = setTimeout(check, 5000);
    const interval = setInterval(check, 5000);
    return () => { cancelled = true; clearTimeout(initialDelay); clearInterval(interval); };
  }, [autoFixAttempted]);

  if (!checked) return null;

  // Case 1: Supabase has session, store does not — the bug we're hunting
  if (supabaseEmail && !authUser) {
    return (
      <View style={[s.banner, s.bannerWarn]}>
        <Ionicons name="warning-outline" size={18} color="#F4A261" />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={s.title}>Sign-in didn't fully complete</Text>
          <Text style={s.sub}>
            Supabase says you're signed in as <Text style={{ fontFamily: 'Inter_700Bold' }}>{supabaseEmail}</Text>,
            but the app's local state didn't update. This is a known bug we're tracking.
          </Text>
          <View style={s.actions}>
            <TouchableOpacity
              style={s.btn}
              onPress={async () => {
                dlog('[fixer] manually syncing authUser from Supabase session');
                try {
                  const { data } = await supabase.auth.getSession();
                  if (data?.session?.user) {
                    useStore.setState({
                      authUser: {
                        id: data.session.user.id,
                        email: data.session.user.email!,
                        createdAt: data.session.user.created_at,
                      },
                      isGuestMode: false,
                      hasOnboarded: true,
                    });
                    dlog('[fixer] authUser set successfully');
                  }
                } catch (e: any) {
                  dwarn('[fixer] failed:', e?.message);
                }
              }}
            >
              <Text style={s.btnTxt}>🔧 Fix sign-in</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.btn, s.btnGhost]} onPress={onOpenDebug}>
              <Text style={[s.btnTxt, s.btnGhostTxt]}>View debug info</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Case 2: Store has authUser but Supabase doesn't — stale state
  if (!supabaseEmail && authUser) {
    return (
      <View style={[s.banner, s.bannerInfo]}>
        <Ionicons name="information-circle-outline" size={18} color="#6FAFF2" />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={s.title}>Local sign-in is stale</Text>
          <Text style={s.sub}>
            The app remembers <Text style={{ fontFamily: 'Inter_700Bold' }}>{authUser.email}</Text> but
            Supabase no longer has an active session.
          </Text>
          <View style={s.actions}>
            <TouchableOpacity
              style={s.btn}
              onPress={() => {
                dlog('[fixer] clearing stale authUser');
                useStore.setState({ authUser: null });
              }}
            >
              <Text style={s.btnTxt}>Clear local state</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // States in sync — no banner
  return null;
};

const s = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 12,
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  bannerWarn: {
    backgroundColor: 'rgba(244,162,97,0.10)',
    borderColor: 'rgba(244,162,97,0.35)',
  },
  bannerInfo: {
    backgroundColor: 'rgba(111,175,242,0.10)',
    borderColor: 'rgba(111,175,242,0.35)',
  },
  title: { fontSize: 13, fontFamily: 'Inter_700Bold', color: '#F0F4FF', marginBottom: 4 },
  sub:   { fontSize: 11, fontFamily: 'Inter_400Regular', color: 'rgba(240,244,255,0.75)', lineHeight: 15 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 10 } as any,
  btn: {
    paddingHorizontal: 12, paddingVertical: 7,
    backgroundColor: '#6FAFF2',
    borderRadius: 8,
  },
  btnTxt: { fontSize: 12, fontFamily: 'Inter_700Bold', color: '#fff' },
  btnGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
  },
  btnGhostTxt: { color: 'rgba(240,244,255,0.85)' },
});
