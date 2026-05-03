// ═══════════════════════════════════════════════════════════════
// StatusVault — App Entry Point v16 · Midnight Glass
// ═══════════════════════════════════════════════════════════════

// CRITICAL: This polyfill MUST be imported before any crypto-using code.
// React Native lacks crypto.getRandomValues by default; without this,
// crypto-js's AES.encrypt fails with "Native crypto module could not
// be used to get secure random number." On web it's a no-op since
// the browser already has crypto.getRandomValues.
import 'react-native-get-random-values';

import React, { useEffect, useState } from 'react';
import { StatusBar, LogBox, View, Text, Platform, Image, Animated, Easing } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Inter_400Regular, Inter_500Medium, Inter_600SemiBold,
  Inter_700Bold, Inter_800ExtraBold, Inter_900Black,
} from '@expo-google-fonts/inter';
import { AppNavigator } from './src/navigation';
import { configureNotifications, clearAppBadge } from './src/utils/notifications';
import { registerDeepLinkHandler } from './src/utils/deepLinkHandler';
import { useStore } from './src/store';
import { colors } from './src/theme';
import { PinLockScreen } from './src/components/PinLockScreen';
import { DialogProvider } from './src/components/ConfirmDialog';

LogBox.ignoreLogs(['Setting a timer', 'expo-notifications', 'Cannot record touch', 'Listening to push token']);

if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const s = document.createElement('style');
  document.title = 'StatusVault — Visa Tracker Dashboard';
  s.textContent = `
    *, *::before, *::after { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    html { height: 100%; }
    body {
      height: 100%; margin: 0; padding: 0; overflow: hidden;
      background: #050B1C;
      color: #F0F4FF;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
    }
    #root { width: 100vw; height: 100vh; display: flex; flex-direction: row; overflow: hidden; background: #050B1C; }
    /* Smooth scrolling */
    div[style*="overflow-y: scroll"], div[style*="overflow: scroll"], div[style*="overflow: auto"] {
      -webkit-overflow-scrolling: touch !important;
    }
    /* Dark scrollbars */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(111,175,242,0.22); border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(111,175,242,0.38); }
    * { scrollbar-width: thin; scrollbar-color: rgba(111,175,242,0.22) transparent; }
    /* Focus rings — blue glow */
    :focus-visible { outline: 2px solid rgba(59,139,232,0.60); outline-offset: 2px; border-radius: 4px; }
    :focus:not(:focus-visible) { outline: none; }
    /* Selection */
    ::selection { background: rgba(59,139,232,0.35); color: #F0F4FF; }
    /* Inputs — make them dark-friendly */
    input, textarea, select {
      color-scheme: dark;
      caret-color: #6FAFF2;
    }
    /* Smooth transitions on interactive elements */
    button, a, [role="button"] { transition: opacity 0.15s ease, transform 0.15s ease; }
    /* Autofill — keep dark */
    input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 1000px rgba(12,26,52,0.95) inset !important;
      -webkit-text-fill-color: #F0F4FF !important;
      caret-color: #6FAFF2 !important;
    }
    /* Date / time / datetime-local inputs — force dark color-scheme so the
       browser's calendar popup shows dark text on a dark background, and
       the input's own digits stay readable. */
    input[type="date"], input[type="time"], input[type="datetime-local"], input[type="month"], input[type="week"] {
      color-scheme: dark !important;
      color: #F0F4FF !important;
      background-color: rgba(255,255,255,0.05) !important;
    }
    /* The little calendar icon at the right edge of date inputs — Chromium
       renders it as a black raster glyph by default, invisible on dark bg.
       Force it bright via brightness/invert filters, then tint it blue. */
    input[type="date"]::-webkit-calendar-picker-indicator,
    input[type="time"]::-webkit-calendar-picker-indicator,
    input[type="datetime-local"]::-webkit-calendar-picker-indicator,
    input[type="month"]::-webkit-calendar-picker-indicator,
    input[type="week"]::-webkit-calendar-picker-indicator {
      filter: invert(70%) sepia(34%) saturate(1287%) hue-rotate(180deg) brightness(105%) contrast(98%);
      cursor: pointer;
      opacity: 0.85;
    }
    input[type="date"]::-webkit-calendar-picker-indicator:hover,
    input[type="time"]::-webkit-calendar-picker-indicator:hover,
    input[type="datetime-local"]::-webkit-calendar-picker-indicator:hover {
      opacity: 1;
    }
    /* Date editing field-text segments inside the input (mm/dd/yyyy spinners) */
    input[type="date"]::-webkit-datetime-edit,
    input[type="time"]::-webkit-datetime-edit,
    input[type="datetime-local"]::-webkit-datetime-edit {
      color: #F0F4FF;
    }
    input[type="date"]::-webkit-datetime-edit-fields-wrapper,
    input[type="time"]::-webkit-datetime-edit-fields-wrapper,
    input[type="datetime-local"]::-webkit-datetime-edit-fields-wrapper {
      color: #F0F4FF;
    }
    input[type="date"]::-webkit-datetime-edit-text,
    input[type="time"]::-webkit-datetime-edit-text,
    input[type="datetime-local"]::-webkit-datetime-edit-text {
      color: rgba(240,244,255,0.55); /* the slashes / colons separators */
      padding: 0 2px;
    }
    input[type="date"]::-webkit-datetime-edit-month-field,
    input[type="date"]::-webkit-datetime-edit-day-field,
    input[type="date"]::-webkit-datetime-edit-year-field,
    input[type="time"]::-webkit-datetime-edit-hour-field,
    input[type="time"]::-webkit-datetime-edit-minute-field,
    input[type="time"]::-webkit-datetime-edit-second-field,
    input[type="time"]::-webkit-datetime-edit-ampm-field,
    input[type="datetime-local"]::-webkit-datetime-edit-month-field,
    input[type="datetime-local"]::-webkit-datetime-edit-day-field,
    input[type="datetime-local"]::-webkit-datetime-edit-year-field {
      color: #F0F4FF;
      caret-color: #6FAFF2;
    }
    /* Selected/focused date segment — show with a brand-blue tint */
    input[type="date"]::-webkit-datetime-edit-month-field:focus,
    input[type="date"]::-webkit-datetime-edit-day-field:focus,
    input[type="date"]::-webkit-datetime-edit-year-field:focus,
    input[type="time"]::-webkit-datetime-edit-hour-field:focus,
    input[type="time"]::-webkit-datetime-edit-minute-field:focus,
    input[type="datetime-local"]::-webkit-datetime-edit-month-field:focus,
    input[type="datetime-local"]::-webkit-datetime-edit-day-field:focus,
    input[type="datetime-local"]::-webkit-datetime-edit-year-field:focus {
      background-color: rgba(59,139,232,0.30);
      color: #fff;
      border-radius: 3px;
    }
    /* Empty placeholder when no date selected — make sure visible on dark */
    input[type="date"]:not(:focus):invalid,
    input[type="datetime-local"]:not(:focus):invalid {
      color: rgba(240,244,255,0.45);
    }
  `;
  document.head.appendChild(s);
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: string | null }
> {
  state = { error: null };
  static getDerivedStateFromError(e: Error) { return { error: e.message }; }
  render() {
    if (this.state.error) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.backgroundDeep, padding: 32 }}>
          <Text style={{ fontSize: 18, fontFamily: 'Inter_700Bold', color: colors.text1, marginBottom: 12 }}>Something went wrong</Text>
          <Text style={{ fontSize: 13, color: colors.text3, textAlign: 'center' }}>{this.state.error}</Text>
          <Text style={{ fontSize: 12, color: colors.text4, marginTop: 16 }}>Try refreshing the page</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

// ─── Loading splash — on-brand, animated ─────────────────────
const LoadingSplash: React.FC = () => {
  // Logo scale pulse — gentle, ~1.4s loop, subtle to feel alive not jittery
  const pulse  = React.useRef(new Animated.Value(0)).current;
  // Glow ring opacity pulse offset from scale for layered effect
  const glow   = React.useRef(new Animated.Value(0)).current;
  // Three loading dots that fade in/out in sequence
  const dot1   = React.useRef(new Animated.Value(0.3)).current;
  const dot2   = React.useRef(new Animated.Value(0.3)).current;
  const dot3   = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    // Logo pulse: 1.0 → 1.06 → 1.0, soft ease, looping
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    ).start();

    // Glow ring: opacity 0.4 → 0.9 → 0.4, slightly out of phase with pulse for depth
    Animated.loop(
      Animated.sequence([
        Animated.delay(200),
        Animated.timing(glow, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    ).start();

    // Dots: classic three-dot ellipsis loader
    const dotAnim = (dot: Animated.Value, delay: number) => Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(dot, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(dot, { toValue: 0.3, duration: 350, useNativeDriver: true }),
        Animated.delay(700 - delay),
      ])
    );
    dotAnim(dot1, 0).start();
    dotAnim(dot2, 200).start();
    dotAnim(dot3, 400).start();
  }, [pulse, glow, dot1, dot2, dot3]);

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] });
  const glowOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.9] });
  const glowScale   = glow.interpolate({ inputRange: [0, 1], outputRange: [1, 1.18] });

  return (
    <View style={{ flex: 1, backgroundColor: '#050B1C', alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 120, height: 120, alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        {/* Animated glow ring behind the logo */}
        <Animated.View
          style={{
            position: 'absolute',
            width: 120, height: 120, borderRadius: 32,
            backgroundColor: 'rgba(59,139,232,0.18)',
            borderWidth: 1, borderColor: 'rgba(59,139,232,0.30)',
            opacity: glowOpacity,
            transform: [{ scale: glowScale }],
          }}
        />
        {/* Inner solid container with the logo, gently pulsing */}
        <Animated.View
          style={{
            width: 84, height: 84, borderRadius: 24,
            backgroundColor: 'rgba(59,139,232,0.12)',
            borderWidth: 1, borderColor: 'rgba(59,139,232,0.30)',
            alignItems: 'center', justifyContent: 'center',
            transform: [{ scale }],
          }}
        >
          <Image
            source={require('./assets/logo-transparent.png')}
            style={{ width: 52, height: 52 }}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      <Text style={{ fontSize: 24, fontFamily: 'Inter_800ExtraBold', color: '#F0F4FF', letterSpacing: -0.5 }}>
        Status<Text style={{ color: '#6FAFF2' }}>Vault</Text>
      </Text>

      <View style={{ flexDirection: 'row', gap: 6, marginTop: 18, alignItems: 'center', height: 12 } as any}>
        <Animated.View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#6FAFF2', opacity: dot1 }} />
        <Animated.View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#6FAFF2', opacity: dot2 }} />
        <Animated.View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#6FAFF2', opacity: dot3 }} />
      </View>
    </View>
  );
};

export default function App() {
  const pinEnabled    = useStore((s) => s.pinEnabled);
  const verifyPin     = useStore((s) => s.verifyPin);
  const initAuth      = useStore((s) => s.initAuth);
  const _hasHydrated  = useStore((s) => s._hasHydrated);
  const [isLocked,  setIsLocked]  = useState(true);
  const [authReady, setAuthReady] = useState(false);

  // Fade-in animation when the splash dismisses and the main app appears.
  // Smooths the transition from splash → dashboard so it doesn't feel like
  // a hard cut. Animation runs once, on first ready state.
  const mainFade = React.useRef(new Animated.Value(0)).current;

  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold,
    Inter_700Bold, Inter_800ExtraBold, Inter_900Black,
  });

  useEffect(() => {
    if (Platform.OS !== 'web') {
      configureNotifications();
      // Clear any iOS app icon badge that lingered from a previous session.
      // expo-notifications increments the badge whenever a scheduled notification
      // fires; iOS does NOT auto-clear it when the user opens the app, so we have
      // to do it explicitly each time.
      clearAppBadge();
    }
    useStore.getState().autoIncrementCounters();
    // Hard timeout — never let the app stay on loading screen
    const authTimeout = setTimeout(() => setAuthReady(true), 3000);
    initAuth().finally(() => {
      clearTimeout(authTimeout);
      setAuthReady(true);
      // Initialize RevenueCat after auth resolves. If a user is signed in,
      // their Supabase ID becomes the RC appUserID so entitlements sync
      // across devices. If no user yet, RC starts anonymous and we logIn
      // later via the store's onAuthStateChange handler.
      if (Platform.OS !== 'web') {
        const userId = useStore.getState().authUser?.id ?? null;
        // Lazy import to keep the bundle clean on web
        import('./src/utils/revenueCat').then(({ initializePurchases, onEntitlementChange, fetchEntitlementState }) => {
          initializePurchases(userId).then(async () => {
            // Bridge entitlement changes into the store
            onEntitlementChange((isActive) => {
              if (useStore.getState().isPremium !== isActive) {
                useStore.setState({ isPremium: isActive });
              }
            });
            // Initial fetch — covers the case where the user already owns
            // premium from a prior install / device
            const isActive = await fetchEntitlementState();
            if (isActive === true && !useStore.getState().isPremium) {
              useStore.setState({ isPremium: true });
            }
          });
        });
      }
    });
    // Force hydration flag after 1s if onRehydrateStorage never fires (empty storage)
    const hydrateTimeout = setTimeout(() => {
      if (!useStore.getState()._hasHydrated) {
        useStore.setState({ _hasHydrated: true });
      }
    }, 1000);

    // Native PIN re-lock + badge clear: when the app returns to foreground.
    let appStateSub: any = null;
    if (Platform.OS !== 'web') {
      const { AppState } = require('react-native');
      let lastState = AppState.currentState;
      appStateSub = AppState.addEventListener('change', (nextState: string) => {
        if (lastState !== 'active' && nextState === 'active') {
          // Always clear the badge — opening the app means user has acknowledged alerts
          clearAppBadge();
          if (useStore.getState().pinEnabled) {
            setIsLocked(true);
          }
        }
        lastState = nextState;
      });
    }

    // Register deep-link handler for magic-link / OAuth callbacks on native.
    // Catches statusvault://auth?... URLs and feeds tokens into Supabase.
    // Safe no-op on web (returns identity cleanup).
    const unregisterDeepLinks = registerDeepLinkHandler();

    return () => {
      clearTimeout(authTimeout);
      clearTimeout(hydrateTimeout);
      appStateSub?.remove?.();
      unregisterDeepLinks();
    };
  }, []);

  // Show loading only briefly — max 3s, never indefinite
  if ((!fontsLoaded && !fontError) || !authReady || !_hasHydrated) {
    return <LoadingSplash />;
  }

  if (pinEnabled && isLocked) {
    return (
      <SafeAreaProvider>
        {Platform.OS !== 'web' && <StatusBar barStyle="light-content" backgroundColor={colors.backgroundDeep} />}
        <PinLockScreen onUnlock={() => setIsLocked(false)} verifyPin={verifyPin} />
      </SafeAreaProvider>
    );
  }

  // Trigger fade-in when we're past the loading gate.
  // useEffect ensures it only fires once we're actually rendering main content.
  React.useEffect(() => {
    if (fontsLoaded && authReady && _hasHydrated) {
      Animated.timing(mainFade, {
        toValue: 1,
        duration: 280,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    }
  }, [fontsLoaded, authReady, _hasHydrated, mainFade]);

  return (
    <ErrorBoundary>
      <Animated.View style={{ flex: 1, opacity: mainFade }}>
        <SafeAreaProvider>
          {Platform.OS !== 'web' && (
            <StatusBar barStyle="light-content" backgroundColor={colors.backgroundDeep} />
          )}
          <DialogProvider>
            <AppNavigator />
          </DialogProvider>
        </SafeAreaProvider>
      </Animated.View>
    </ErrorBoundary>
  );
}
