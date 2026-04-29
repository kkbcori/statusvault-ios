// ═══════════════════════════════════════════════════════════════
// StatusVault — Premium Upsell Banner
// In-app self-promotion shown to guest + free users on Dashboard.
// Hidden entirely for premium users. Tapping the CTA opens the
// existing PaywallModal — same flow as Settings → Unlock Premium.
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store';
import { PaywallModal } from './PaywallModal';

export const PremiumUpsellBanner: React.FC = () => {
  const isPremium = useStore(s => s.isPremium);
  const setPremium = useStore(s => s.setPremium);
  const [paywallOpen, setPaywallOpen] = useState(false);

  // Hide entirely for premium users — this banner is the "ad" they paid to remove
  if (isPremium) return null;

  return (
    <>
      <TouchableOpacity
        style={s.banner}
        onPress={() => setPaywallOpen(true)}
        activeOpacity={0.85}
        accessibilityLabel="Upgrade to StatusVault Premium"
      >
        <LinearGradient
          colors={['rgba(59,139,232,0.18)', 'rgba(245,192,83,0.10)', 'rgba(59,139,232,0.18)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.gradient}
        >
          {/* Left: sparkle + text */}
          <View style={s.left}>
            <View style={s.iconWrap}>
              <Ionicons name="sparkles" size={18} color="#F5C053" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.title}>
                Unlock Premium <Text style={s.price}>$3.99</Text> <Text style={s.period}>one-time</Text>
              </Text>
              <Text style={s.sub}>Unlimited docs · No ads · Pay once, yours forever</Text>
            </View>
          </View>

          {/* Right: CTA chevron */}
          <View style={s.cta}>
            <Ionicons name="chevron-forward" size={16} color="#6FAFF2" />
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <PaywallModal
        visible={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        onUnlock={() => {
          setPremium(true);
          setPaywallOpen(false);
        }}
      />
    </>
  );
};

const s = StyleSheet.create({
  banner: {
    marginHorizontal: 12,
    marginTop: 14,
    marginBottom: 4,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(245,192,83,0.30)',
    ...(Platform.OS === 'web' ? ({ boxShadow: '0 6px 18px rgba(0,0,0,0.20)' } as any) : {}),
  } as any,
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  } as any,
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  } as any,
  iconWrap: {
    width: 36, height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(245,192,83,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(245,192,83,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#F0F4FF',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  price: {
    fontFamily: 'Inter_900Black',
    color: '#F5C053',
  },
  period: {
    fontFamily: 'Inter_500Medium',
    color: 'rgba(245,192,83,0.85)',
    fontSize: 12,
  },
  sub: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: 'rgba(240,244,255,0.65)',
  },
  cta: {
    width: 28, height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(111,175,242,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(111,175,242,0.30)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
