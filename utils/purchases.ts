import { Platform } from "react-native";

// ============================================================
// RevenueCat Integration for UnMount
// ============================================================
// Setup steps:
// 1. Create account at https://www.revenuecat.com
// 2. Create a project, add iOS + Android apps
// 3. Configure products in App Store Connect / Google Play Console:
//    - unmount_pro_monthly ($4.99/month)
//    - unmount_pro_yearly ($29.99/year)
//    - unmount_pro_lifetime ($49.99 one-time)
// 4. Add entitlement "pro" in RevenueCat dashboard
// 5. Replace API keys below
// 6. Install: npx expo install react-native-purchases
// ============================================================

const API_KEYS = {
  apple: "YOUR_REVENUECAT_APPLE_API_KEY",
  google: "goog_vVzSSoSusODHNkFhpPDsasEZbMe",
};

const ENTITLEMENT_ID = "pro";

export const PRODUCT_IDS = {
  monthly: "unmount_pro_monthly",
  yearly: "unmount_pro_yearly",
  lifetime: "unmount_pro_lifetime",
} as const;

export interface SubscriptionStatus {
  isPro: boolean;
  activeProduct: string | null;
  expiresAt: string | null;
}

// ---- RevenueCat wrapper ----
// This module wraps RevenueCat so the rest of the app only
// imports from here.

let _isPro = false;
let _purchases: any = null;

/**
 * Initialize RevenueCat. Call once at app startup.
 */
export async function initializePurchases(userId?: string): Promise<void> {
  try {
    const Purchases = require("react-native-purchases").default;
    _purchases = Purchases;

    const apiKey = Platform.OS === "ios" ? API_KEYS.apple : API_KEYS.google;
    await Purchases.configure({ apiKey, appUserID: userId });

    const customerInfo = await Purchases.getCustomerInfo();
    _isPro = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

    console.log("[Purchases] Initialized");
  } catch (e) {
    console.error("[Purchases] Init failed:", e);
  }
}

/**
 * Check current pro status.
 */
export async function checkProStatus(): Promise<SubscriptionStatus> {
  try {
    if (_purchases) {
      const customerInfo = await _purchases.getCustomerInfo();
      const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];
      return {
        isPro: !!entitlement,
        activeProduct: entitlement?.productIdentifier ?? null,
        expiresAt: entitlement?.expirationDate ?? null,
      };
    }
  } catch (e) {
    console.error("[Purchases] Status check failed:", e);
  }
  return { isPro: _isPro, activeProduct: null, expiresAt: null };
}

/**
 * Fetch available packages (products) for display on the paywall.
 */
export async function getOfferings(): Promise<PaywallPackage[]> {
  try {
    if (_purchases) {
      const offerings = await _purchases.getOfferings();
      if (offerings.current) {
        return offerings.current.availablePackages.map((pkg: any) => ({
          id: pkg.identifier,
          productId: pkg.product.identifier,
          title: pkg.product.title,
          description: pkg.product.description,
          price: pkg.product.priceString,
          priceValue: pkg.product.price,
          period: pkg.packageType,
          package: pkg,
        }));
      }
    }
  } catch (e) {
    console.error("[Purchases] Offerings fetch failed:", e);
  }

  // Fallback display data when RevenueCat isn't configured yet
  return [
    {
      id: "monthly",
      productId: PRODUCT_IDS.monthly,
      title: "Monthly",
      description: "Full access, billed monthly",
      price: "$4.99",
      priceValue: 4.99,
      period: "monthly",
      package: null,
    },
    {
      id: "yearly",
      productId: PRODUCT_IDS.yearly,
      title: "Yearly",
      description: "Full access, billed yearly",
      price: "$29.99",
      priceValue: 29.99,
      period: "annual",
      package: null,
    },
    {
      id: "lifetime",
      productId: PRODUCT_IDS.lifetime,
      title: "Lifetime",
      description: "Pay once, own forever",
      price: "$49.99",
      priceValue: 49.99,
      period: "lifetime",
      package: null,
    },
  ];
}

export interface PaywallPackage {
  id: string;
  productId: string;
  title: string;
  description: string;
  price: string;
  priceValue: number;
  period: string;
  package: any;
}

/**
 * Purchase a package. Returns true if successful.
 */
export async function purchasePackage(pkg: PaywallPackage): Promise<boolean> {
  try {
    if (_purchases && pkg.package) {
      const { customerInfo } = await _purchases.purchasePackage(pkg.package);
      const isPro = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
      _isPro = isPro;
      return isPro;
    }
    // Stub mode: simulate success for development
    console.log("[Purchases] Stub purchase:", pkg.productId);
    _isPro = true;
    return true;
  } catch (e: any) {
    if (e.userCancelled) {
      return false;
    }
    console.error("[Purchases] Purchase failed:", e);
    return false;
  }
}

/**
 * Restore previous purchases (required by App Store guidelines).
 */
export async function restorePurchases(): Promise<boolean> {
  try {
    if (_purchases) {
      const customerInfo = await _purchases.restorePurchases();
      _isPro = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
      return _isPro;
    }
    console.log("[Purchases] Stub restore");
    return _isPro;
  } catch (e) {
    console.error("[Purchases] Restore failed:", e);
    return false;
  }
}import { Platform } from "react-native";

// ============================================================
// RevenueCat Integration for UnMount
// ============================================================
// Setup steps:
// 1. Create account at https://www.revenuecat.com
// 2. Create a project, add iOS + Android apps
// 3. Configure products in App Store Connect / Google Play Console:
//    - unmount_pro_monthly  ($4.99/month)
//    - unmount_pro_yearly   ($29.99/year)
//    - unmount_pro_lifetime ($49.99 one-time)
// 4. Add entitlement "pro" in RevenueCat dashboard
// 5. Replace API keys below
// 6. Install: npx expo install react-native-purchases
// ============================================================

const API_KEYS = {
  apple: "YOUR_REVENUECAT_APPLE_API_KEY",
  google: "YOUR_REVENUECAT_GOOGLE_API_KEY",
};

const ENTITLEMENT_ID = "pro";

export const PRODUCT_IDS = {
  monthly: "unmount_pro_monthly",
  yearly: "unmount_pro_yearly",
  lifetime: "unmount_pro_lifetime",
} as const;

export interface SubscriptionStatus {
  isPro: boolean;
  activeProduct: string | null;
  expiresAt: string | null;
}

// ---- RevenueCat wrapper ----
// This module wraps RevenueCat so the rest of the app only
// imports from here. When you're ready to go live, install
// react-native-purchases and uncomment the real implementation.

let _isPro = false;
let _purchases: any = null;

/**
 * Initialize RevenueCat. Call once at app startup.
 */
export async function initializePurchases(userId?: string): Promise<void> {
  try {
    // Uncomment when react-native-purchases is installed:
    // const Purchases = require("react-native-purchases").default;
    // _purchases = Purchases;
    //
    // const apiKey = Platform.OS === "ios" ? API_KEYS.apple : API_KEYS.google;
    // await Purchases.configure({ apiKey, appUserID: userId });
    //
    // const customerInfo = await Purchases.getCustomerInfo();
    // _isPro = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

    console.log("[Purchases] Initialized (stub mode)");
  } catch (e) {
    console.error("[Purchases] Init failed:", e);
  }
}

/**
 * Check current pro status.
 */
export async function checkProStatus(): Promise<SubscriptionStatus> {
  try {
    if (_purchases) {
      const customerInfo = await _purchases.getCustomerInfo();
      const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];
      return {
        isPro: !!entitlement,
        activeProduct: entitlement?.productIdentifier ?? null,
        expiresAt: entitlement?.expirationDate ?? null,
      };
    }
  } catch (e) {
    console.error("[Purchases] Status check failed:", e);
  }

  return { isPro: _isPro, activeProduct: null, expiresAt: null };
}

/**
 * Fetch available packages (products) for display on the paywall.
 */
export async function getOfferings(): Promise<PaywallPackage[]> {
  try {
    if (_purchases) {
      const offerings = await _purchases.getOfferings();
      if (offerings.current) {
        return offerings.current.availablePackages.map((pkg: any) => ({
          id: pkg.identifier,
          productId: pkg.product.identifier,
          title: pkg.product.title,
          description: pkg.product.description,
          price: pkg.product.priceString,
          priceValue: pkg.product.price,
          period: pkg.packageType,
          package: pkg, // keep reference for purchase
        }));
      }
    }
  } catch (e) {
    console.error("[Purchases] Offerings fetch failed:", e);
  }

  // Fallback display data when RevenueCat isn't configured yet
  return [
    {
      id: "monthly",
      productId: PRODUCT_IDS.monthly,
      title: "Monthly",
      description: "Full access, billed monthly",
      price: "$4.99",
      priceValue: 4.99,
      period: "monthly",
      package: null,
    },
    {
      id: "yearly",
      productId: PRODUCT_IDS.yearly,
      title: "Yearly",
      description: "Full access, billed yearly",
      price: "$29.99",
      priceValue: 29.99,
      period: "annual",
      package: null,
    },
    {
      id: "lifetime",
      productId: PRODUCT_IDS.lifetime,
      title: "Lifetime",
      description: "Pay once, own forever",
      price: "$49.99",
      priceValue: 49.99,
      period: "lifetime",
      package: null,
    },
  ];
}

export interface PaywallPackage {
  id: string;
  productId: string;
  title: string;
  description: string;
  price: string;
  priceValue: number;
  period: string;
  package: any;
}

/**
 * Purchase a package. Returns true if successful.
 */
export async function purchasePackage(pkg: PaywallPackage): Promise<boolean> {
  try {
    if (_purchases && pkg.package) {
      const { customerInfo } = await _purchases.purchasePackage(pkg.package);
      const isPro =
        customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
      _isPro = isPro;
      return isPro;
    }

    // Stub mode: simulate success for development
    console.log("[Purchases] Stub purchase:", pkg.productId);
    _isPro = true;
    return true;
  } catch (e: any) {
    if (e.userCancelled) {
      return false;
    }
    console.error("[Purchases] Purchase failed:", e);
    return false;
  }
}

/**
 * Restore previous purchases (required by App Store guidelines).
 */
export async function restorePurchases(): Promise<boolean> {
  try {
    if (_purchases) {
      const customerInfo = await _purchases.restorePurchases();
      _isPro =
        customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
      return _isPro;
    }

    console.log("[Purchases] Stub restore");
    return _isPro;
  } catch (e) {
    console.error("[Purchases] Restore failed:", e);
    return false;
  }
}
