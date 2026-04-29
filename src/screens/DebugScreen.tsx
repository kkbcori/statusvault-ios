// ═══════════════════════════════════════════════════════════════
// StatusVault — Debug Screen
// ───────────────────────────────────────────────────────────────
// Hidden diagnostic screen for inspecting auth state, storage,
// and recent logs without needing Xcode/Console.app.
//
// Access: long-press the StatusVault title in the dashboard hero.
// ═══════════════════════════════════════════════════════════════

import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform,
  TextInput, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, SUPABASE_SESSION_KEY } from '../utils/supabase';
import { useStore } from '../store';
import {
  getDebugLogs, subscribeToLogs, clearDebugLogs, dlog, dwarn,
  type DebugLogEntry,
} from '../utils/debugLog';

interface Props {
  onClose: () => void;
}

export const DebugScreen: React.FC<Props> = ({ onClose }) => {
  const authUser = useStore(s => s.authUser);
  const [logs, setLogs] = useState<DebugLogEntry[]>(getDebugLogs());
  const [supabaseSession, setSupabaseSession] = useState<string>('checking...');
  const [storageSession, setStorageSession] = useState<string>('checking...');
  const [allKeys, setAllKeys] = useState<string[]>([]);
  const [manualCode, setManualCode] = useState('');

  const refreshAll = async () => {
    setLogs(getDebugLogs());
    try {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setSupabaseSession(`✓ Signed in as ${data.session.user.email}`);
      } else {
        setSupabaseSession('✗ No active session');
      }
    } catch (e: any) {
      setSupabaseSession(`✗ Error: ${e.message}`);
    }
    try {
      const raw = await AsyncStorage.getItem(SUPABASE_SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setStorageSession(`✓ Session in storage (user: ${parsed?.user?.email ?? 'unknown'})`);
      } else {
        setStorageSession('✗ No session in storage');
      }
    } catch (e: any) {
      setStorageSession(`✗ Read error: ${e.message}`);
    }
    try {
      const keys = await AsyncStorage.getAllKeys();
      setAllKeys(keys.filter(k => k.includes('supabase') || k.includes('auth') || k.includes('sb-')));
    } catch {
      setAllKeys([]);
    }
  };

  useEffect(() => {
    refreshAll();
    const unsub = subscribeToLogs(() => setLogs(getDebugLogs()));
    return unsub;
  }, []);

  const tryManualExchange = async () => {
    if (!manualCode.trim()) {
      Alert.alert('No code', 'Paste an OAuth code or full URL first.');
      return;
    }
    let code = manualCode.trim();
    // Allow pasting a full URL — extract the code param
    const codeMatch = code.match(/[?&]code=([^&#]+)/);
    if (codeMatch) code = codeMatch[1];
    dlog('[debug] manual exchange started, code:', code.substring(0, 12) + '...');
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        dwarn('[debug] manual exchange error:', error.message);
        Alert.alert('Exchange failed', error.message);
      } else if (data?.session) {
        dlog('[debug] manual exchange OK, session for', data.session.user.email);
        Alert.alert('Success', `Signed in as ${data.session.user.email}`);
      } else {
        dwarn('[debug] manual exchange returned no error and no session');
      }
    } catch (e: any) {
      dwarn('[debug] manual exchange threw:', e?.message ?? e);
      Alert.alert('Threw', e?.message ?? String(e));
    }
    refreshAll();
  };

  const clearStorageAndSignOut = async () => {
    Alert.alert(
      'Clear storage?',
      'Removes the Supabase session from AsyncStorage and signs out. Use only if auth is stuck.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear', style: 'destructive', onPress: async () => {
            try {
              await supabase.auth.signOut();
              await AsyncStorage.removeItem(SUPABASE_SESSION_KEY);
              dlog('[debug] storage cleared + signed out');
            } catch (e: any) {
              dwarn('[debug] clear failed:', e?.message ?? e);
            }
            refreshAll();
          },
        },
      ],
    );
  };

  const fmtTime = (ts: number) => {
    const d = new Date(ts);
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}.${String(d.getMilliseconds()).padStart(3,'0')}`;
  };

  return (
    <View style={s.root}>
      <View style={s.header}>
        <Text style={s.title}>🔧 Debug Console</Text>
        <TouchableOpacity onPress={onClose} style={s.closeBtn}>
          <Text style={s.closeBtnTxt}>Close</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 14 }}>

        {/* Auth status */}
        <Text style={s.sectionLabel}>Supabase session (live)</Text>
        <Text style={[s.statusLine, supabaseSession.startsWith('✓') ? s.ok : s.fail]}>{supabaseSession}</Text>

        <Text style={s.sectionLabel}>AsyncStorage session</Text>
        <Text style={[s.statusLine, storageSession.startsWith('✓') ? s.ok : s.fail]}>{storageSession}</Text>

        <Text style={s.sectionLabel}>Store authUser</Text>
        <Text style={[s.statusLine, authUser ? s.ok : s.fail]}>
          {authUser ? `✓ ${authUser.email}` : '✗ null'}
        </Text>

        <Text style={s.sectionLabel}>Auth-related storage keys ({allKeys.length})</Text>
        {allKeys.length === 0 ? (
          <Text style={s.empty}>(none found)</Text>
        ) : (
          allKeys.map(k => <Text key={k} style={s.keyLine}>{k}</Text>)
        )}

        {/* Actions */}
        <View style={{ marginTop: 16, gap: 8 } as any}>
          <TouchableOpacity onPress={refreshAll} style={s.actionBtn}>
            <Text style={s.actionBtnTxt}>↻ Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={clearStorageAndSignOut} style={[s.actionBtn, s.actionBtnDanger]}>
            <Text style={[s.actionBtnTxt, s.actionBtnDangerTxt]}>⚠ Clear storage + sign out</Text>
          </TouchableOpacity>
        </View>

        {/* Manual exchange */}
        <Text style={s.sectionLabel}>Manual code exchange (paste OAuth callback URL or just code=)</Text>
        <TextInput
          value={manualCode}
          onChangeText={setManualCode}
          placeholder="statusvault://auth?code=..."
          placeholderTextColor="rgba(240,244,255,0.30)"
          style={s.input}
          autoCapitalize="none"
          autoCorrect={false}
          multiline
        />
        <TouchableOpacity onPress={tryManualExchange} style={s.actionBtn}>
          <Text style={s.actionBtnTxt}>▶ Try exchange</Text>
        </TouchableOpacity>

        {/* Logs */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 } as any}>
          <Text style={s.sectionLabel}>Recent logs ({logs.length})</Text>
          <TouchableOpacity onPress={() => { clearDebugLogs(); setLogs([]); }}>
            <Text style={{ fontSize: 11, color: '#FF6B6B', fontFamily: 'Inter_600SemiBold' }}>Clear logs</Text>
          </TouchableOpacity>
        </View>

        <View style={s.logsBox}>
          {logs.length === 0 ? (
            <Text style={s.empty}>(no logs yet — try Google sign-in then come back)</Text>
          ) : (
            logs.map((entry, i) => (
              <View key={i} style={s.logRow}>
                <Text style={s.logTime}>{fmtTime(entry.ts)}</Text>
                <Text style={[
                  s.logMsg,
                  entry.level === 'warn' && s.logWarn,
                  entry.level === 'error' && s.logError,
                ]}>{entry.message}</Text>
              </View>
            ))
          )}
        </View>

        <Text style={s.footnote}>
          Build: {Platform.OS} · {Platform.Version}
        </Text>
      </ScrollView>
    </View>
  );
};

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A0F1F' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)',
    paddingTop: Platform.OS === 'ios' ? 50 : 14,
  } as any,
  title: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#F0F4FF' },
  closeBtn: { paddingHorizontal: 14, paddingVertical: 7, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 8 },
  closeBtnTxt: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#F0F4FF' },

  sectionLabel: {
    fontSize: 10, fontFamily: 'Inter_700Bold', color: 'rgba(240,244,255,0.55)',
    letterSpacing: 0.6, textTransform: 'uppercase' as any,
    marginTop: 14, marginBottom: 4,
  } as any,
  statusLine: {
    fontSize: 12, fontFamily: 'Inter_500Medium',
    paddingVertical: 6, paddingHorizontal: 10,
    borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.04)',
  },
  ok: { color: '#4CD98A' },
  fail: { color: '#FF6B6B' },
  empty: { fontSize: 11, fontFamily: 'Inter_400Regular', color: 'rgba(240,244,255,0.45)', fontStyle: 'italic' as any } as any,
  keyLine: { fontSize: 11, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', color: 'rgba(240,244,255,0.70)', paddingVertical: 2 } as any,

  actionBtn: {
    backgroundColor: 'rgba(111,175,242,0.12)',
    borderWidth: 1, borderColor: 'rgba(111,175,242,0.28)',
    borderRadius: 8, paddingVertical: 10, alignItems: 'center',
  },
  actionBtnTxt: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#6FAFF2' },
  actionBtnDanger: { backgroundColor: 'rgba(255,107,107,0.10)', borderColor: 'rgba(255,107,107,0.28)' },
  actionBtnDangerTxt: { color: '#FF6B6B' },

  input: {
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: 8, padding: 10, marginBottom: 8,
    fontSize: 11, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#F0F4FF', backgroundColor: 'rgba(255,255,255,0.04)',
    minHeight: 60, textAlignVertical: 'top' as any,
  } as any,

  logsBox: {
    backgroundColor: '#06091A', borderRadius: 8,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    padding: 8, marginTop: 6, minHeight: 200,
  },
  logRow: { paddingVertical: 3, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  logTime: { fontSize: 9, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', color: 'rgba(240,244,255,0.40)' } as any,
  logMsg: { fontSize: 11, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', color: 'rgba(240,244,255,0.85)', marginTop: 2 } as any,
  logWarn: { color: '#F4A261' },
  logError: { color: '#FF6B6B' },

  footnote: { fontSize: 10, fontFamily: 'Inter_400Regular', color: 'rgba(240,244,255,0.30)', textAlign: 'center', marginTop: 18 },
});
