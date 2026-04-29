import React, { useState } from 'react';
import {
  Platform, View, Text, StyleSheet, TouchableOpacity, Modal,
  ActivityIndicator, TextInput, KeyboardAvoidingView, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../store';
import { IS_WEB } from '../utils/responsive';
import { supabase } from '../utils/supabase';
import { colors } from '../theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  message?: string;
}

type Mode = 'password' | 'register' | 'set-password';

// ── Cross-platform inputs ─────────────────────────────────────
const EmailInput = ({ value, onChange, onSubmit }: { value: string; onChange: (v: string) => void; onSubmit?: () => void }) =>
  IS_WEB ? (
    <input
      type="email" value={value}
      onChange={(e: any) => onChange(e.target.value)}
      onKeyDown={(e: any) => { if (e.key === 'Enter') onSubmit?.(); }}
      placeholder="you@email.com" autoFocus maxLength={254}
      style={inputStyle}
    />
  ) : (
    <TextInput
      style={s.nativeInput} value={value} onChangeText={onChange}
      placeholder="you@email.com" placeholderTextColor="rgba(240,244,255,0.40)"
      keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
      returnKeyType="done" onSubmitEditing={onSubmit}
    />
  );

const PasswordInput = ({ value, onChange, onSubmit, showPwd, placeholder }: {
  value: string; onChange: (v: string) => void; onSubmit?: () => void;
  showPwd: boolean; placeholder?: string;
}) =>
  IS_WEB ? (
    <input
      type={showPwd ? 'text' : 'password'} value={value}
      onChange={(e: any) => onChange(e.target.value)}
      onKeyDown={(e: any) => { if (e.key === 'Enter') onSubmit?.(); }}
      placeholder={placeholder ?? 'Your password'}
      style={{ ...inputStyle, paddingRight: '40px' } as any}
    />
  ) : (
    <TextInput
      style={s.nativeInput} value={value} onChangeText={onChange}
      placeholder={placeholder ?? 'Your password'} placeholderTextColor="rgba(240,244,255,0.40)"
      secureTextEntry={!showPwd} autoCapitalize="none" autoCorrect={false}
      returnKeyType="done" onSubmitEditing={onSubmit}
    />
  );

export const AuthModal: React.FC<Props> = ({ visible, onClose, onSuccess, message }) => {
  const signInWithPassword = useStore((s) => s.signInWithPassword);
  const signUp             = useStore((s) => s.signUp);
  const setPassword        = useStore((s) => s.setPassword);
  const authUser           = useStore((s) => s.authUser);

  const [mode,       setMode]       = useState<Mode>('password');
  const [email,      setEmail]      = useState('');
  const [password,   setPassword2]  = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd,    setShowPwd]    = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [googleLoad, setGoogleLoad] = useState(false);
  const [error,      setError]      = useState('');
  const [success,    setSuccess]    = useState('');

  const reset = () => {
    setEmail(''); setPassword2(''); setConfirmPwd('');
    setLoading(false); setGoogleLoad(false);
    setError(''); setSuccess(''); setShowPwd(false);
  };
  const handleClose = () => { reset(); onClose(); };

  const handleGoogle = async () => {
    setGoogleLoad(true); setError('');
    try {
      const redirectTo = Platform.OS !== 'web'
        ? 'statusvault://auth'
        : (typeof window !== 'undefined' && window.location.hostname === 'localhost'
            ? window.location.origin
            : 'https://www.statusvault.org');

      // On web: signInWithOAuth redirects the browser automatically.
      // On native: it returns { data: { url } } and we MUST open the URL ourselves.
      // Without this, the user taps "Continue with Google" and absolutely nothing happens
      // because the OAuth handshake never starts.
      const { data, error: err } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          // skipBrowserRedirect prevents the SDK from trying to redirect via window.location
          // on web environments where it doesn't make sense (e.g., embedded webview).
          // On native it has no effect — the SDK can't redirect anyway.
          skipBrowserRedirect: Platform.OS !== 'web',
        },
      });
      if (err) { setError(err.message); return; }

      if (Platform.OS !== 'web' && data?.url) {
        // Open the OAuth URL in the system browser. After Google auth, the browser
        // hits Supabase's callback, which then 302s back to statusvault://auth?code=...
        // — picked up by registerDeepLinkHandler() in App.tsx.
        const { Linking } = require('react-native');
        const supported = await Linking.canOpenURL(data.url);
        if (!supported) {
          setError('Unable to open browser for Google sign-in.');
          return;
        }
        await Linking.openURL(data.url);
        // Don't close the modal — wait for deep-link return to set authUser.
        // The modal will close automatically via onAuthStateChange listener.
      } else {
        // Web path: SDK handled the redirect, just close
        onClose();
      }
    } catch (e: any) { setError(e.message ?? 'Google sign-in failed'); }
    finally { setGoogleLoad(false); }
  };

  const handlePasswordLogin = async () => {
    setError('');
    if (!email.trim() || !email.includes('@')) { setError('Enter a valid email address.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const { error: err } = await signInWithPassword(email.trim(), password);
      if (err) { setError(err); return; }
      reset(); onSuccess?.(); onClose();
    } finally { setLoading(false); }
  };

  const handleRegister = async () => {
    setError(''); setSuccess('');
    if (!email.trim() || !email.includes('@')) { setError('Enter a valid email address.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirmPwd) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      const { error: err } = await signUp(email.trim(), password);
      if (err) { setError(err); return; }
      setSuccess('Account created! Check your email to verify, then sign in below.');
      setMode('password');
      setPassword2(''); setConfirmPwd('');
    } finally { setLoading(false); }
  };

  const handleSetPassword = async () => {
    setError(''); setSuccess('');
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirmPwd) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      const { error: err } = await setPassword(password);
      if (err) { setError(err); return; }
      setSuccess('Password set! You can now sign in with email + password.');
      setPassword2(''); setConfirmPwd('');
    } finally { setLoading(false); }
  };

  // Set Password mode
  if (mode === 'set-password' || (visible && authUser && message?.includes('set') && message?.includes('password'))) {
    const content = (
      <View style={s.sheet}>
        <LinearGradient colors={['#050B1C', '#0A1530']} style={s.header}>
          <View style={s.headerIcon}><Ionicons name="key-outline" size={22} color={colors.primaryLight} /></View>
          <View style={{ flex: 1 }}>
            <Text style={s.headerTitle}>Set a Password</Text>
            <Text style={s.headerSub}>Optional — lets you sign in with email + password</Text>
          </View>
          <TouchableOpacity style={s.closeBtn} onPress={handleClose}>
            <Ionicons name="close" size={18} color="rgba(240,244,255,0.60)" />
          </TouchableOpacity>
        </LinearGradient>
        <View style={s.body}>
          {error ? <View style={s.errorBox}><Ionicons name="alert-circle" size={15} color={colors.danger} /><Text style={s.errorTxt}>{error}</Text></View> : null}
          {success ? <View style={s.successBox}><Ionicons name="checkmark-circle" size={15} color={colors.success} /><Text style={s.successTxt}>{success}</Text></View> : null}
          <Text style={s.label}>New Password</Text>
          <PasswordInput value={password} onChange={setPassword2} showPwd={showPwd} placeholder="8+ characters" />
          <Text style={s.label}>Confirm Password</Text>
          <PasswordInput value={confirmPwd} onChange={setConfirmPwd} showPwd={showPwd} placeholder="Re-enter password" onSubmit={handleSetPassword} />
          <TouchableOpacity style={s.submitBtn} onPress={handleSetPassword} disabled={loading} activeOpacity={0.85}>
            <LinearGradient colors={[colors.primary, colors.primaryMid]} style={s.submitGrad}>
              {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={s.submitTxt}>Set Password</Text>}
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClose} style={{ marginTop: 10, alignItems: 'center' }}>
            <Text style={s.linkTxt}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
    return <ModalWrapper visible={visible} onClose={handleClose}>{content}</ModalWrapper>;
  }

  const content = (
    <View style={s.sheet}>
      <LinearGradient colors={['#050B1C', '#0A1530']} style={s.header}>
        <View style={s.headerIcon}><Ionicons name="shield-checkmark" size={22} color={colors.primaryLight} /></View>
        <View style={{ flex: 1 }}>
          <Text style={s.headerTitle}>Sign in to StatusVault</Text>
          <Text style={s.headerSub}>{message ?? 'Sign in with Google or your email'}</Text>
        </View>
        <TouchableOpacity style={s.closeBtn} onPress={handleClose}>
          <Ionicons name="close" size={18} color="rgba(240,244,255,0.60)" />
        </TouchableOpacity>
      </LinearGradient>

      <View style={s.body}>
        <TouchableOpacity style={s.googleBtn} onPress={handleGoogle} disabled={googleLoad} activeOpacity={0.85}>
          {googleLoad ? <ActivityIndicator size="small" color="#6FAFF2" /> : (
            <>
              {IS_WEB
                ? <span dangerouslySetInnerHTML={{ __html: `<svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-3.59-13.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>` }} />
                : <Image
                    source={require('../../assets/google-logo.png')}
                    style={{ width: 18, height: 18 }}
                    resizeMode="contain"
                  />
              }
              <Text style={s.googleTxt}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={s.divRow}><View style={s.divLine} /><Text style={s.divTxt}>or</Text><View style={s.divLine} /></View>

        {error ? <View style={s.errorBox}><Ionicons name="alert-circle" size={15} color={colors.danger} /><Text style={s.errorTxt}>{error}</Text></View> : null}
        {success ? <View style={s.successBox}><Ionicons name="checkmark-circle" size={15} color={colors.success} /><Text style={s.successTxt}>{success}</Text></View> : null}

        {mode === 'password' && (
          <>
            <Text style={s.label}>Email address</Text>
            <EmailInput value={email} onChange={setEmail} />
            <Text style={s.label}>Password</Text>
            <View style={{ position: 'relative' as any }}>
              <PasswordInput value={password} onChange={setPassword2} onSubmit={handlePasswordLogin} showPwd={showPwd} />
              <TouchableOpacity onPress={() => setShowPwd((v) => !v)} style={s.eyeBtn}>
                <Ionicons name={showPwd ? 'eye-off-outline' : 'eye-outline'} size={16} color="rgba(240,244,255,0.55)" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={s.submitBtn} onPress={handlePasswordLogin} disabled={loading} activeOpacity={0.85}>
              <LinearGradient colors={[colors.primary, colors.primaryMid]} style={s.submitGrad}>
                {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={s.submitTxt}>Sign In</Text>}
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setMode('register'); setError(''); setSuccess(''); }} style={{ alignItems: 'center', marginTop: 12 }}>
              <Text style={s.linkTxt}>New here? Create an account →</Text>
            </TouchableOpacity>
          </>
        )}

        {mode === 'register' && (
          <>
            <Text style={s.label}>Email address</Text>
            <EmailInput value={email} onChange={setEmail} />
            <Text style={s.label}>Password</Text>
            <View style={{ position: 'relative' as any }}>
              <PasswordInput value={password} onChange={setPassword2} onSubmit={handleRegister} showPwd={showPwd} />
              <TouchableOpacity onPress={() => setShowPwd((v) => !v)} style={s.eyeBtn}>
                <Ionicons name={showPwd ? 'eye-off-outline' : 'eye-outline'} size={16} color="rgba(240,244,255,0.55)" />
              </TouchableOpacity>
            </View>
            <Text style={s.label}>Confirm password</Text>
            <PasswordInput value={confirmPwd} onChange={setConfirmPwd} onSubmit={handleRegister} showPwd={showPwd} />
            <TouchableOpacity style={s.submitBtn} onPress={handleRegister} disabled={loading} activeOpacity={0.85}>
              <LinearGradient colors={[colors.primary, colors.primaryMid]} style={s.submitGrad}>
                {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={s.submitTxt}>Create Account</Text>}
              </LinearGradient>
            </TouchableOpacity>
            <Text style={s.hint}>By creating an account, you agree to our Terms and Privacy Policy.</Text>
            <TouchableOpacity onPress={() => { setMode('password'); setError(''); setSuccess(''); }} style={{ alignItems: 'center', marginTop: 8 }}>
              <Text style={s.linkTxt}>Already have an account? Sign in →</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  return <ModalWrapper visible={visible} onClose={handleClose}>{content}</ModalWrapper>;
};

// ── Modal wrapper ───────────────────────────────────────────
const ModalWrapper: React.FC<{ visible: boolean; onClose: () => void; children: React.ReactNode }> = ({ visible, onClose, children }) => {
  if (IS_WEB) {
    if (!visible) return null;
    return (
      <View style={s.overlay} pointerEvents="box-none">
        <TouchableOpacity style={s.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={s.centeredBox}>{children}</View>
      </View>
    );
  }
  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={s.overlay}>
          <TouchableOpacity style={s.backdrop} activeOpacity={1} onPress={onClose} />
          <View style={s.centeredBox}>{children}</View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const inputStyle = {
  width: '100%', padding: '12px 14px', fontSize: '14px', fontFamily: 'Inter, sans-serif',
  color: '#F0F4FF',
  border: '1px solid rgba(255,255,255,0.14)', borderRadius: '10px',
  backgroundColor: 'rgba(255,255,255,0.05)',
  outline: 'none', boxSizing: 'border-box',
  marginBottom: '12px', display: 'block',
  colorScheme: 'dark',
  caretColor: '#6FAFF2',
} as any;

const s = StyleSheet.create({
  overlay:     { position: 'absolute' as any, inset: 0, zIndex: 2000, alignItems: 'center', justifyContent: 'center' } as any,
  backdrop:    { position: 'absolute' as any, inset: 0, backgroundColor: 'rgba(3,8,18,0.80)' } as any,
  centeredBox: { width: '100%', maxWidth: 420, zIndex: 1 } as any,
  sheet: {
    backgroundColor: '#0C1A34',
    borderRadius: 20, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    ...Platform.select({ web: { boxShadow: '0 24px 64px rgba(0,0,0,0.55)' } as any, default: {} }),
  } as any,
  header:      { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 20 },
  headerIcon:  { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(59,139,232,0.18)', borderWidth: 1, borderColor: 'rgba(111,175,242,0.30)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#F0F4FF', marginBottom: 2 },
  headerSub:   { fontSize: 11, fontFamily: 'Inter_400Regular', color: 'rgba(240,244,255,0.60)', lineHeight: 16 },
  closeBtn:    { width: 28, height: 28, borderRadius: 7, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },

  body:        { padding: 20 },

  googleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10, paddingVertical: 12, marginBottom: 14,
  } as any,
  googleTxt: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#F0F4FF' },

  divRow:  { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  divLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
  divTxt:  { fontSize: 11, fontFamily: 'Inter_500Medium', color: 'rgba(240,244,255,0.40)' },

  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,107,107,0.10)', borderRadius: 8, padding: 10, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,107,107,0.30)' },
  errorTxt: { flex: 1, fontSize: 12, fontFamily: 'Inter_500Medium', color: colors.danger },
  successBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(76,217,138,0.10)', borderRadius: 8, padding: 10, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(76,217,138,0.30)' },
  successTxt: { flex: 1, fontSize: 12, fontFamily: 'Inter_500Medium', color: colors.success },

  label: { fontSize: 11, fontFamily: 'Inter_700Bold', color: 'rgba(240,244,255,0.60)', letterSpacing: 0.6, marginBottom: 6, textTransform: 'uppercase' as any } as any,
  nativeInput: {
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, fontFamily: 'Inter_400Regular',
    color: '#F0F4FF',
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 12,
  },
  eyeBtn:     { position: 'absolute' as any, right: 12, top: 10, padding: 4 } as any,

  submitBtn:  { borderRadius: 10, overflow: 'hidden', marginBottom: 10, ...(Platform.OS === 'web' ? ({ boxShadow: '0 6px 20px rgba(59,139,232,0.35)' } as any) : {}) } as any,
  submitGrad: { paddingVertical: 13, alignItems: 'center', justifyContent: 'center' },
  submitTxt:  { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#fff' },

  hint:    { fontSize: 11, fontFamily: 'Inter_400Regular', color: 'rgba(240,244,255,0.45)', textAlign: 'center' },
  linkTxt: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: colors.primaryLight, textAlign: 'center' },
});
