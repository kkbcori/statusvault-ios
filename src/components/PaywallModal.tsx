import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform, Image, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useStore, FREE_LIMIT } from '../store';
import {
  isRevenueCatConfigured,
  getCurrentOffering,
  purchasePackage,
  restorePurchases,
} from '../utils/revenueCat';

const FALLBACK_PRICE = '$3.99';
const PRICE_TAG = 'one-time';
const IS_WEB = Platform.OS === 'web';

const FEATURES = [
  { icon: 'documents-outline'        as const, text: 'Unlimited documents for you & family'  },
  { icon: 'people-outline'           as const, text: 'Unlimited family members & their docs'  },
  { icon: 'checkbox-outline'         as const, text: 'Unlimited checklists & immi timers'     },
  { icon: 'document-text-outline'    as const, text: 'PDF export — N-400, I-485 & all docs'  },
  { icon: 'cloud-outline'            as const, text: 'AES-256 encrypted cloud backup'         },
  { icon: 'notifications-outline'    as const, text: 'Smart alerts at 6mo · 3mo · 1mo · 7d'  },
  { icon: 'shield-checkmark-outline' as const, text: 'No ads, ever'                           },
];

interface Props {
  visible: boolean;
  onClose: () => void;
  onUnlock: () => void;
}

export const PaywallModal: React.FC<Props> = ({ visible, onClose, onUnlock }) => {
  const documents  = useStore(s => s.documents);
  const authUser   = useStore(s => s.authUser);
  const atLimit    = documents.length >= FREE_LIMIT;

  const [pkg,       setPkg]       = useState<any>(null);
  const [price,     setPrice]     = useState<string>(FALLBACK_PRICE);
  const [busy,      setBusy]      = useState<'purchase'|'restore'|null>(null);
  const [errorMsg,  setErrorMsg]  = useState<string | null>(null);

  // Fetch the offering when the paywall opens (only on native + when RC configured)
  useEffect(() => {
    if (!visible || IS_WEB || !isRevenueCatConfigured()) return;
    let cancelled = false;
    getCurrentOffering().then((res) => {
      if (cancelled || !res) return;
      setPkg(res.pkg);
      setPrice(res.priceString);
    });
    return () => { cancelled = true; };
  }, [visible]);

  const showAlert = (title: string, message: string) => {
    if (IS_WEB && typeof window !== 'undefined') {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleUnlock = async () => {
    setErrorMsg(null);
    // Fall back to test-unlock when RC isn't configured yet (web, or before
    // you've pasted the API key into revenueCatConfig.ts).
    if (IS_WEB || !isRevenueCatConfigured()) {
      onUnlock();
      return;
    }
    // Real IAP flow requires a signed-in user so RC can attribute the purchase
    // to a stable appUserID for cross-device sync.
    if (!authUser) {
      showAlert(
        'Sign In Required',
        'Please create an account or sign in before purchasing premium. This lets your purchase sync across all your devices.'
      );
      return;
    }
    if (!pkg) {
      showAlert(
        'Not Available',
        'Premium isn\'t available right now. Please try again in a moment.'
      );
      return;
    }
    setBusy('purchase');
    try {
      const isActive = await purchasePackage(pkg);
      if (isActive) {
        onUnlock();
      } else {
        setErrorMsg('Purchase completed but premium not active. Please contact support.');
      }
    } catch (e: any) {
      if (e?.message === 'CANCELLED') {
        // User cancelled — no error to show
      } else {
        setErrorMsg(e?.message ?? 'Purchase failed. Please try again.');
      }
    } finally {
      setBusy(null);
    }
  };

  const handleRestore = async () => {
    setErrorMsg(null);
    if (IS_WEB || !isRevenueCatConfigured()) {
      showAlert('Not Available', 'Restore purchases is only available in the iOS app.');
      return;
    }
    if (!authUser) {
      showAlert(
        'Sign In Required',
        'Please sign in with the same account you used when you purchased premium.'
      );
      return;
    }
    setBusy('restore');
    try {
      const isActive = await restorePurchases();
      if (isActive) {
        showAlert('Restored', 'Your premium purchase has been restored.');
        onUnlock();
      } else {
        showAlert(
          'Nothing to Restore',
          'We couldn\'t find a previous premium purchase for this Apple ID.'
        );
      }
    } catch (e: any) {
      setErrorMsg(e?.message ?? 'Restore failed. Please try again.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent statusBarTranslucent>
      <View style={s.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFillObject as any} activeOpacity={1} onPress={onClose} />

        <View style={s.card}>
          {/* Dark header */}
          <LinearGradient colors={['#050B1C', '#0A1530', '#123A72']} style={s.header}>
            <View style={s.orb1} /><View style={s.orb2} />

            <TouchableOpacity style={s.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={16} color="rgba(255,255,255,0.50)" />
            </TouchableOpacity>

            <View style={s.iconWrap}>
              <View style={s.iconGrad}>
                <Image
                  source={require('../../assets/logo-transparent.png')}
                  style={{ width: 56, height: 56 }}
                  resizeMode="contain"
                />
              </View>
            </View>

            <Text style={s.eyebrow}>✦ STATUSVAULT PREMIUM</Text>
            <Text style={s.title}>Protect Your{'\n'}Immigration Status</Text>
            <View style={s.titleUnderline} />
            <Text style={s.subtitle}>
              {atLimit
                ? `You've used all ${FREE_LIMIT} free document slots`
                : 'Unlock the full power of StatusVault'}
            </Text>
          </LinearGradient>

          {/* Body */}
          <View style={s.body}>

            {/* Single price card */}
            <View style={s.priceCard}>
              <View style={s.priceBadge}>
                <Text style={s.priceBadgeTxt}>ONE-TIME PURCHASE</Text>
              </View>
              <View style={s.priceRow}>
                <Text style={s.priceAmount}>{price}</Text>
                <View style={{ marginLeft: 6 }}>
                  <Text style={s.pricePeriod}>{PRICE_TAG}</Text>
                  <Text style={s.priceSub}>no subscription</Text>
                </View>
              </View>
              <Text style={s.priceNote}>Pay once · Yours forever · Across all your devices</Text>
            </View>

            {/* Feature list */}
            <View style={s.featureList}>
              {FEATURES.map(({ icon, text }, i) => (
                <View key={i} style={s.featureRow}>
                  <View style={s.featureCheck2}>
                    <Ionicons name="checkmark" size={12} color="#6FAFF2" />
                  </View>
                  <Text style={s.featureText}>{text}</Text>
                </View>
              ))}
            </View>

            {/* Inline error */}
            {errorMsg && (
              <View style={s.errorBox}>
                <Ionicons name="alert-circle-outline" size={14} color="#FF6B6B" />
                <Text style={s.errorTxt}>{errorMsg}</Text>
              </View>
            )}

            {/* CTA */}
            <TouchableOpacity
              style={[s.cta, busy && { opacity: 0.6 }]}
              onPress={handleUnlock}
              activeOpacity={0.88}
              disabled={busy !== null}
            >
              <LinearGradient colors={['#6FAFF2', '#3B8BE8']} style={s.ctaGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                {busy === 'purchase' ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Ionicons name="star" size={15} color="#FCD34D" />
                    <Text style={s.ctaTxt}>
                      Unlock Premium — {price}
                    </Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Restore button — Apple REQUIRES this for IAP apps */}
            <TouchableOpacity
              style={s.restoreBtn}
              onPress={handleRestore}
              activeOpacity={0.7}
              disabled={busy !== null}
            >
              {busy === 'restore' ? (
                <ActivityIndicator color="#6FAFF2" size="small" />
              ) : (
                <Text style={s.restoreTxt}>Restore Purchases</Text>
              )}
            </TouchableOpacity>

            <Text style={s.legal}>One-time payment · Secure checkout · AES-256 encrypted</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const s = StyleSheet.create({
  overlay:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  card:       { width: '100%', maxWidth: 420, borderRadius: 24, overflow: 'hidden', ...Platform.select({ web: { boxShadow: '0 24px 64px rgba(0,0,0,0.40)' } as any }) } as any,

  header:     { padding: 24, alignItems: 'center', overflow: 'hidden', position: 'relative' as any },
  orb1:       { position: 'absolute' as any, top: -30, right: -30, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(59,139,232,0.18)' },
  orb2:       { position: 'absolute' as any, bottom: -20, left: -20, width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(245,192,83,0.10)' },
  closeBtn:   { position: 'absolute' as any, top: 14, right: 14, width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  iconWrap:   { marginBottom: 12 },
  iconGrad:   {
    width: 76, height: 76, borderRadius: 18,
    backgroundColor: 'rgba(59,139,232,0.12)',
    borderWidth: 1, borderColor: 'rgba(111,175,242,0.32)',
    alignItems: 'center', justifyContent: 'center',
    ...(Platform.OS === 'web' ? ({ boxShadow: '0 0 32px rgba(59,139,232,0.30)' } as any) : {}),
  } as any,
  eyebrow:    { fontSize: 10, fontFamily: 'Inter_700Bold', color: '#6FAFF2', letterSpacing: 2, marginBottom: 8 },
  title:      { fontSize: 24, fontFamily: 'Inter_900Black', color: '#F0F4FF', textAlign: 'center', letterSpacing: -0.5, lineHeight: 30, marginBottom: 10 },
  titleUnderline: { width: 40, height: 3, backgroundColor: '#6FAFF2', borderRadius: 2, marginBottom: 10 },
  subtitle:   { fontSize: 12, fontFamily: 'Inter_400Regular', color: 'rgba(203,213,225,0.60)', textAlign: 'center' },

  body:       { backgroundColor: '#0C1A34', padding: 20 },

  // Single price card
  priceCard:  {
    borderWidth: 1.5, borderColor: '#6FAFF2',
    backgroundColor: 'rgba(59,139,232,0.14)',
    borderRadius: 14, padding: 16, marginBottom: 16,
    alignItems: 'center', position: 'relative' as any,
  } as any,
  priceBadge: { position: 'absolute' as any, top: -10, backgroundColor: '#6FAFF2', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  priceBadgeTxt: { fontSize: 9, fontFamily: 'Inter_800ExtraBold', color: '#fff', letterSpacing: 0.8 },
  priceRow:   { flexDirection: 'row', alignItems: 'baseline', marginTop: 8 } as any,
  priceAmount:{ fontSize: 42, fontFamily: 'Inter_900Black', color: '#6FAFF2', letterSpacing: -1.5, lineHeight: 46 },
  pricePeriod:{ fontSize: 12, fontFamily: 'Inter_700Bold', color: '#6FAFF2', marginBottom: 1 },
  priceSub:   { fontSize: 10, fontFamily: 'Inter_500Medium', color: 'rgba(111,175,242,0.65)' },
  priceNote:  { fontSize: 11, fontFamily: 'Inter_500Medium', color: 'rgba(240,244,255,0.65)', textAlign: 'center', marginTop: 8 },

  // Features
  featureList:{ marginBottom: 14, gap: 2 } as any,
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 5 },
  featureCheck2:{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgba(59,139,232,0.14)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(111,175,242,0.30)' },
  featureText:{ fontSize: 12, fontFamily: 'Inter_500Medium', color: '#F0F4FF', flex: 1 },

  // CTA
  cta:        { borderRadius: 12, overflow: 'hidden', marginBottom: 10 },
  ctaGrad:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, minHeight: 48 },
  ctaTxt:     { fontSize: 15, fontFamily: 'Inter_800ExtraBold', color: '#fff', letterSpacing: 0.2 },

  // Restore — Apple requires this button to be visible
  restoreBtn: { paddingVertical: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 6, minHeight: 36 },
  restoreTxt: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#6FAFF2' },

  // Inline error
  errorBox:   { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 10, marginBottom: 10, backgroundColor: 'rgba(255,107,107,0.10)', borderWidth: 1, borderColor: 'rgba(255,107,107,0.30)', borderRadius: 8 },
  errorTxt:   { flex: 1, fontSize: 12, fontFamily: 'Inter_500Medium', color: '#FF6B6B' },

  legal:      { fontSize: 11, fontFamily: 'Inter_400Regular', color: 'rgba(240,244,255,0.45)', textAlign: 'center' },
});
