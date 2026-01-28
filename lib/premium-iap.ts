import * as RNIap from 'react-native-iap';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { updatePremiumStatus } from './database';
import { supabase } from './supabase';
import { logger } from '@/utils/logger';

// Product ID for your one-time purchase
const PRODUCT_ID = Platform.OS === 'ios'
  ? 'com.logmylog.app.premium' // You'll need to create this in App Store Connect
  : 'premium_299'; // Production product ID in Google Play Console

// Track if IAP is initialized
let iapInitialized = false;
let iapInitPromise: Promise<void> | null = null;

/**
 * Initialize IAP (react-native-iap)
 */
export async function initializeIAP(userId?: string): Promise<void> {
  if (iapInitialized) {
    return;
  }

  if (iapInitPromise) {
    return iapInitPromise;
  }

  iapInitPromise = (async () => {
    try {
      // Initialize connection
      await RNIap.initConnection();
      logger.log('[IAP] Initialized successfully');
      
      // Get available purchases (to restore if needed)
      const purchases = await RNIap.getAvailablePurchases();
      logger.log('[IAP] Available purchases:', purchases.length);
      
      iapInitialized = true;
    } catch (error) {
      iapInitPromise = null;
      logger.safeError('[IAP] Failed to initialize', error);
      throw error;
    }
  })();

  return iapInitPromise;
}

/**
 * Check if user has premium (by checking for active purchase)
 * 
 * DEV OVERRIDE: Set to true for testing purposes
 */
const DEV_PREMIUM_OVERRIDE = false; // Set to true to force premium status for testing

export async function checkIAPPremium(): Promise<boolean> {
  // Dev override for testing
  if (DEV_PREMIUM_OVERRIDE) {
    logger.log('[IAP] DEV MODE: Premium status forced to true');
    return true;
  }
  
  try {
    // Get available purchases
    const purchases = await RNIap.getAvailablePurchases();
    
    // Check if user has purchased the premium product
    const hasPremium = purchases.some(
      purchase => purchase.productId === PRODUCT_ID
    );
    
    logger.log('[IAP] Premium status:', hasPremium);
    return hasPremium;
  } catch (error) {
    logger.safeError('[IAP] Error checking premium status', error);
    return false;
  }
}

/**
 * Sync premium status to database
 */
export async function syncPremiumStatus(): Promise<void> {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      logger.log('[IAP] No user found, skipping premium sync');
      return;
    }

    // Check IAP premium status (includes dev override)
    const isPremium = await checkIAPPremium();

    // Update database
    await updatePremiumStatus(isPremium);
    logger.log('[IAP] Premium status synced to database:', isPremium);
  } catch (error) {
    logger.safeError('[IAP] Error syncing premium status', error);
    // Don't throw - allow app to continue even if sync fails
  }
}

/**
 * Get premium products
 * Returns products in a format compatible with the existing UI
 */
export async function getPremiumProducts(): Promise<any[]> {
  try {
    // Ensure IAP is initialized
    await initializeIAP();

    console.log('[IAP] Requesting product:', PRODUCT_ID);
    console.log('[IAP] Platform:', Platform.OS);
    
    // Verify package name matches
    const packageName = Constants.expoConfig?.android?.package || Constants.manifest?.android?.package || 'unknown';
    console.log('[IAP] App package name:', packageName);
    console.log('[IAP] Expected package name: com.logmylog.app');
    if (packageName !== 'com.logmylog.app') {
      console.warn('[IAP] ⚠️ Package name mismatch! This could cause product lookup to fail.');
    }
    
    // Try to get all products first (for debugging)
    try {
      console.log('[IAP] Attempting to query all products (debug)...');
      // This might help us see if ANY products are available
      const allProducts = await RNIap.getProducts({ skus: [] });
      console.log('[IAP] All products query result:', allProducts.length, 'products');
    } catch (debugError) {
      console.log('[IAP] All products query failed (expected):', debugError);
    }
    
    // Get product details from store
    console.log('[IAP] Querying specific product:', PRODUCT_ID);
    const products = await RNIap.getProducts({ skus: [PRODUCT_ID] });
    
    console.log('[IAP] Received products:', products.length);
    if (products.length > 0) {
      console.log('[IAP] Product details:', JSON.stringify(products[0], null, 2));
    } else {
      console.warn('[IAP] No products returned. This could mean:');
      console.warn('[IAP] - Product ID mismatch');
      console.warn('[IAP] - Product not available in your region');
      console.warn('[IAP] - App signing key mismatch');
      console.warn('[IAP] - Product not yet propagated (wait 5-10 minutes)');
      
      // Try to get more info about available products
      try {
        // This might help debug - try getting all available products
        console.log('[IAP] Attempting to get connection state...');
        const availablePurchases = await RNIap.getAvailablePurchases();
        console.log('[IAP] Available purchases:', availablePurchases.length);
      } catch (debugError) {
        console.error('[IAP] Debug error:', debugError);
      }
    }
    
    if (products.length === 0) {
      const errorMsg = `Product "${PRODUCT_ID}" not found. Please verify:
1. Product ID matches exactly in Google Play Console (case-sensitive): "${PRODUCT_ID}"
2. Product status is "Active" (not Draft or Inactive) ✅ You confirmed this
3. App is published to at least Internal Testing track ✅ You confirmed this
4. App is installed from Play Store (not local build) ✅ You confirmed this
5. Using licensed tester account ✅ You confirmed this
6. Product is available in your region (173 countries should cover you)
7. App package name matches: com.logmylog.app
8. Wait 5-10 minutes after any changes for propagation

If all above are correct, this might be an app signing key mismatch.`;
      console.error('[IAP]', errorMsg);
      throw new Error(errorMsg);
    }

    // Convert to format compatible with existing UI
    const formattedProducts = products.map(product => ({
      vendorProductId: product.productId,
      localizedTitle: product.title,
      localizedPrice: product.localizedPrice,
      price: product.price,
      currency: product.currency,
      platform: Platform.OS,
    }));

    console.log('[IAP] Products loaded:', formattedProducts);
    return formattedProducts;
  } catch (error: any) {
    console.error('[IAP] Error getting products:', error);
    throw new Error(`Failed to load products: ${error?.message || error}`);
  }
}

/**
 * Purchase premium product
 */
export async function purchasePremium(productId: string): Promise<void> {
  try {
    // Ensure IAP is initialized
    await initializeIAP();

    console.log('[IAP] Initiating purchase for:', productId);

    // Request purchase - react-native-iap v12+ requires object format
    // Android: { skus: [productId] }
    // iOS: { sku: productId }
    const purchaseRequest = Platform.OS === 'ios' 
      ? { sku: productId }
      : { skus: [productId] };
    
    const purchase = await RNIap.requestPurchase(purchaseRequest, false);
    
    console.log('[IAP] Purchase initiated, waiting for completion...');

    // Wait for purchase to complete
    const purchaseResult = await purchase;
    
    console.log('[IAP] Purchase completed:', purchaseResult);

    // Acknowledge purchase (required for non-consumable products)
    if (purchaseResult.transactionReceipt) {
      try {
        await RNIap.finishTransaction(purchaseResult, false);
        console.log('[IAP] Purchase acknowledged');
      } catch (ackError) {
        console.warn('[IAP] Error acknowledging purchase:', ackError);
        // Don't throw - purchase was successful, just acknowledgment failed
      }
    }

    // Sync premium status to database
    await syncPremiumStatus();

    console.log('[IAP] Purchase successful, premium activated');
  } catch (error: any) {
    console.error('[IAP] Error purchasing:', error);
    
    // Handle user cancellation
    if (error.code === 'E_USER_CANCELLED' || error.message?.includes('cancelled')) {
      throw new Error('Purchase was cancelled');
    }
    
    throw new Error(`Purchase failed: ${error?.message || error}`);
  }
}

/**
 * Restore purchases (for users who already purchased)
 */
export async function restorePurchases(): Promise<boolean> {
  try {
    await initializeIAP();
    
    const purchases = await RNIap.getAvailablePurchases();
    const hasPremium = purchases.some(p => p.productId === PRODUCT_ID);
    
    if (hasPremium) {
      await syncPremiumStatus();
    }
    
    return hasPremium;
  } catch (error) {
    console.error('[IAP] Error restoring purchases:', error);
    return false;
  }
}

/**
 * Cleanup IAP connection (call when app closes)
 */
export async function endConnection(): Promise<void> {
  try {
    await RNIap.endConnection();
    iapInitialized = false;
    iapInitPromise = null;
    console.log('[IAP] Connection ended');
  } catch (error) {
    console.error('[IAP] Error ending connection:', error);
  }
}

// Compatibility aliases for existing code
export const initializeAdapty = initializeIAP;
export const checkAdaptyPremium = checkIAPPremium;
