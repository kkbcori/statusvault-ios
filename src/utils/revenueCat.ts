// ═══════════════════════════════════════════════════════════════
// StatusVault — RevenueCat SDK Wrapper
// ═══════════════════════════════════════════════════════════════
// All interactions with react-native-purchases go through this
// module so we have one place to:
//   - guard against the SDK not being configured
//   - guard against web (where this SDK doesn't run)
//   - handle errors uniformly
//   - log diagnostics into the in-app debug console
// ═══════════════════════════════════════════════════════════════

import { Platform } from 'react-native';
import {
  REVENUECAT_IOS_API_KEY,
  REVENUECAT_ANDROID_API_KEY,
  REVENUECAT_ENTITLEMENT_ID,
  REVENUECAT_OFFERING_ID,
  isRevenueCatConfigured,
} from './revenueCatConfig';
import { dlog, dwarn, derror } from './debugLog';

const IS_WEB = Platform.OS === 'web';

let _initialized = false;
let _entitlementListener: ((isActive: boolean) => void) | null = null;

/**
 * Lazy-load react-native-purchases. The dynamic import avoids
 * crashing the bundler on web (where this package isn't supported).
 */
async function loadSDK() {
  if (IS_WEB) return null;
  try {
    const mod: any = await import('react-native-purchases');
    return mod.default ?? mod;
  } catch (e: any) {
    dwarn('[RC] failed to load react-native-purchases:', e?.message ?? e);
    return null;
  }
}

/**
 * Initialize the SDK. Safe to call multiple times — only the first
 * call actually configures. Pass the user's Supabase ID so RC tracks
 * entitlements per-user rather than per-device.
 */
export async function initializePurchases(supabaseUserId: string | null): Promise<void> {
  if (IS_WEB) {
    dlog('[RC] web platform — skipping init');
    return;
  }
  if (!isRevenueCatConfigured()) {
    dlog('[RC] no API key set — skipping init (paywall will use test-unlock fallback)');
    return;
  }
  if (_initialized) {
    // Already configured — just update the user identity if it changed.
    if (supabaseUserId) await identifyUser(supabaseUserId);
    return;
  }

  const Purchases = await loadSDK();
  if (!Purchases) return;

  try {
    const apiKey = Platform.OS === 'ios' ? REVENUECAT_IOS_API_KEY : REVENUECAT_ANDROID_API_KEY;
    if (!apiKey) {
      dwarn('[RC] no API key for platform', Platform.OS);
      return;
    }

    Purchases.configure({
      apiKey,
      appUserID: supabaseUserId ?? undefined, // anonymous if no Supabase user yet
    });
    _initialized = true;
    dlog('[RC] configured for', Platform.OS, 'user:', supabaseUserId ?? 'anonymous');

    // Listen for entitlement changes (purchase, restore, refund, expiry)
    Purchases.addCustomerInfoUpdateListener((customerInfo: any) => {
      const isActive = !!customerInfo?.entitlements?.active?.[REVENUECAT_ENTITLEMENT_ID];
      dlog('[RC] CustomerInfo update — premium active:', isActive);
      if (_entitlementListener) _entitlementListener(isActive);
    });
  } catch (e: any) {
    derror('[RC] configure failed:', e?.message ?? e);
  }
}

/**
 * Tie the current device's RC identity to a Supabase user ID.
 * Call this on sign-in. RevenueCat will fetch any existing entitlement
 * for that user (e.g., from a prior purchase on another device).
 */
export async function identifyUser(supabaseUserId: string): Promise<void> {
  if (IS_WEB || !_initialized) return;
  const Purchases = await loadSDK();
  if (!Purchases) return;
  try {
    const result = await Purchases.logIn(supabaseUserId);
    dlog('[RC] logIn ok — created:', result?.created, 'user:', supabaseUserId);
  } catch (e: any) {
    derror('[RC] logIn failed:', e?.message ?? e);
  }
}

/**
 * Sign out from RevenueCat. Call this when the user signs out of Supabase.
 * Returns RC to anonymous identity.
 */
export async function logoutPurchases(): Promise<void> {
  if (IS_WEB || !_initialized) return;
  const Purchases = await loadSDK();
  if (!Purchases) return;
  try {
    await Purchases.logOut();
    dlog('[RC] logOut ok');
  } catch (e: any) {
    // logOut throws if user is anonymous; that's fine to ignore.
    dlog('[RC] logOut noop:', e?.message ?? e);
  }
}

/**
 * Subscribe to entitlement state changes. Used by the store to keep
 * `isPremium` in sync with RC.
 */
export function onEntitlementChange(handler: (isActive: boolean) => void): void {
  _entitlementListener = handler;
}

/**
 * Fetch the current entitlement state. Useful on app open / after sign-in.
 * Returns null if RC isn't configured (caller should treat as "unknown").
 */
export async function fetchEntitlementState(): Promise<boolean | null> {
  if (IS_WEB || !_initialized) return null;
  const Purchases = await loadSDK();
  if (!Purchases) return null;
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const isActive = !!customerInfo?.entitlements?.active?.[REVENUECAT_ENTITLEMENT_ID];
    dlog('[RC] fetchEntitlementState — premium active:', isActive);
    return isActive;
  } catch (e: any) {
    derror('[RC] fetchEntitlementState failed:', e?.message ?? e);
    return null;
  }
}

/**
 * Fetch the offering and its first available package. The paywall calls
 * this to show the real product price.
 */
export async function getCurrentOffering(): Promise<{ pkg: any; priceString: string } | null> {
  if (IS_WEB || !_initialized) return null;
  const Purchases = await loadSDK();
  if (!Purchases) return null;
  try {
    const offerings = await Purchases.getOfferings();
    // Try named offering first, fall back to "current" which RC sets automatically
    const offering = offerings?.all?.[REVENUECAT_OFFERING_ID] ?? offerings?.current;
    if (!offering) {
      dwarn('[RC] no offering found — check RevenueCat dashboard configuration');
      return null;
    }
    const pkg = offering.availablePackages?.[0];
    if (!pkg) {
      dwarn('[RC] offering has no packages — attach a product in RevenueCat dashboard');
      return null;
    }
    return { pkg, priceString: pkg.product?.priceString ?? '$3.99' };
  } catch (e: any) {
    derror('[RC] getCurrentOffering failed:', e?.message ?? e);
    return null;
  }
}

/**
 * Run the purchase flow. Returns true if the entitlement is now active.
 * Throws on user cancellation so the caller can distinguish from real errors.
 */
export async function purchasePackage(pkg: any): Promise<boolean> {
  if (IS_WEB || !_initialized) {
    throw new Error('In-app purchases are only available in the iOS app.');
  }
  const Purchases = await loadSDK();
  if (!Purchases) throw new Error('Purchases SDK not available');
  try {
    const result = await Purchases.purchasePackage(pkg);
    const isActive = !!result?.customerInfo?.entitlements?.active?.[REVENUECAT_ENTITLEMENT_ID];
    dlog('[RC] purchase complete — premium active:', isActive);
    return isActive;
  } catch (e: any) {
    if (e?.userCancelled) {
      dlog('[RC] purchase cancelled by user');
      throw new Error('CANCELLED');
    }
    derror('[RC] purchase failed:', e?.message ?? e);
    throw new Error(e?.message ?? 'Purchase failed. Please try again.');
  }
}

/**
 * Restore previously-purchased entitlements. Apple REQUIRES a "Restore Purchases"
 * button to be visible in apps that sell IAPs — they reject submissions without it.
 */
export async function restorePurchases(): Promise<boolean> {
  if (IS_WEB || !_initialized) {
    throw new Error('Restore purchases is only available in the iOS app.');
  }
  const Purchases = await loadSDK();
  if (!Purchases) throw new Error('Purchases SDK not available');
  try {
    const customerInfo = await Purchases.restorePurchases();
    const isActive = !!customerInfo?.entitlements?.active?.[REVENUECAT_ENTITLEMENT_ID];
    dlog('[RC] restore complete — premium active:', isActive);
    return isActive;
  } catch (e: any) {
    derror('[RC] restore failed:', e?.message ?? e);
    throw new Error(e?.message ?? 'Restore failed. Please try again.');
  }
}

export { isRevenueCatConfigured };
