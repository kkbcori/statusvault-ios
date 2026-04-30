// ═══════════════════════════════════════════════════════════════
// StatusVault — RevenueCat Configuration
// ═══════════════════════════════════════════════════════════════
// Paste values here once your RevenueCat dashboard is set up.
// Until REVENUECAT_IOS_API_KEY is non-empty, the app will run in
// "test unlock" mode — paywall sets premium directly without IAP.
//
// IMPORTANT: The iOS API key is a PUBLIC key meant to be embedded
// in client apps. Safe to commit. Server-side secrets (App Store
// Connect API key for receipt validation) live in RevenueCat's
// dashboard, not in your code.
// ═══════════════════════════════════════════════════════════════

/**
 * Public iOS SDK key from RevenueCat dashboard.
 * Find it: app.revenuecat.com → Project → API keys → "Public app-specific API keys" → Apple App Store
 * Looks like: "appl_AbCdEf1234567890..."
 */
export const REVENUECAT_IOS_API_KEY = '';

/**
 * Public Android SDK key (for future Android build — leave empty for now).
 * Find it: app.revenuecat.com → Project → API keys → "Public app-specific API keys" → Google Play
 */
export const REVENUECAT_ANDROID_API_KEY = '';

/**
 * The entitlement identifier you create in the RevenueCat dashboard.
 * This is the "thing" the user gets when they buy. We grant unlimited
 * tracking when this entitlement is active.
 *
 * Recommended value: "premium"
 * Configure: app.revenuecat.com → Project → Entitlements → New Entitlement
 */
export const REVENUECAT_ENTITLEMENT_ID = 'premium';

/**
 * The offering identifier — a "menu" of packages. RevenueCat calls one
 * "current" by default, which is what we'll show on the paywall.
 *
 * Recommended value: "default" (RevenueCat creates this automatically)
 * Configure: app.revenuecat.com → Project → Offerings
 */
export const REVENUECAT_OFFERING_ID = 'default';

/**
 * Returns true once you've pasted in a real iOS API key.
 * Used to gracefully fall back to test-unlock when the SDK isn't configured yet.
 */
export const isRevenueCatConfigured = (): boolean => {
  return REVENUECAT_IOS_API_KEY.trim().length > 0;
};
