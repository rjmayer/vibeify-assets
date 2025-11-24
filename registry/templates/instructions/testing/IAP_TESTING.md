# In-App Purchase (IAP) Testing Guide

This guide documents the procedures for testing in-app purchases in CatchLog+ for both Android (Google Play) and iOS (App Store) platforms.

## Overview

CatchLog+ implements a **one-time 4.99 € premium unlock** that provides:
- AI-powered fishing insights
- CSV/PDF export functionality
- Private group creation and joining
- 14-day forecasts
- Unlimited photos
- Bulk exports
- Custom bait lists

## Prerequisites

Before testing IAP functionality:

1. **Development Environment Setup**
   - Ensure you have Expo EAS configured
   - Have access to both Google Play Console and App Store Connect
   - Test devices or emulators ready (Android and iOS)

2. **Product Configuration**
   - Product ID: `catchlogplus_premium_unlock` (recommended)
   - Price: 4.99 € (equivalent in other currencies)
   - Type: Non-consumable (one-time purchase)

## Android IAP Testing (Google Play)

### 1. Google Play Console Setup

1. **Create the In-App Product**
   - Navigate to Google Play Console → Your App → Monetize → In-app products
   - Click "Create product"
   - Product ID: `catchlogplus_premium_unlock`
   - Product type: One-time
   - Name: "CatchLog+ Premium"
   - Description: "Unlock AI insights, exports, and private groups"
   - Price: 4.99 € (set for all countries)
   - Status: Set to "Active"

2. **Configure License Testing**
   - Go to Settings → License Testing
   - Add test Gmail accounts under "License testers"
   - These accounts can make test purchases without being charged

3. **Create a Closed Testing Track**
   - Navigate to Testing → Closed testing
   - Create a new track (e.g., "IAP Testing")
   - Upload an APK/AAB with IAP implementation
   - Add testers (same as license testers)

### 2. Testing Procedures (Android)

#### Sandbox Testing

1. **Device Preparation**
   - Ensure device is signed in with a test account (added in Play Console)
   - Clear Google Play Store cache: Settings → Apps → Google Play Store → Storage → Clear cache
   - Verify test account: Open Play Store → Check account is correct

2. **Testing Steps**
   ```
   1. Install the app from the closed testing track
   2. Launch the app and navigate to premium features
   3. Tap "Upgrade to Premium" or similar button
   4. Verify the purchase dialog shows "Test Card" or your test account
   5. Complete the purchase (you won't be charged)
   6. Verify premium features are unlocked
   7. Close and reopen the app
   8. Verify purchase persists (premium still unlocked)
   ```

3. **Test Purchase Cancellation**
   - Google Play Console → Order Management
   - Find test purchase and cancel it
   - Verify app handles cancellation gracefully

#### Common Android Issues

**Issue**: "The item you requested is not available for purchase"
- **Fix**: Ensure the product ID matches exactly in code and Play Console
- **Fix**: Wait 2-4 hours after creating the in-app product
- **Fix**: Verify the app version code matches the uploaded APK/AAB

**Issue**: Purchase dialog doesn't appear
- **Fix**: Check that the app is signed with the same key as the Play Console release
- **Fix**: Verify test account is added to license testers
- **Fix**: Clear Play Store cache and data

**Issue**: Purchase doesn't persist after restart
- **Fix**: Implement proper purchase restoration logic
- **Fix**: Store purchase state in local storage/database
- **Fix**: Query Google Play for active purchases on app startup

### 3. Testing Checklist (Android)

- [ ] Product created in Play Console
- [ ] Test account added to license testers
- [ ] APK/AAB uploaded to closed track
- [ ] Test account can see purchase dialog
- [ ] Purchase completes successfully
- [ ] Premium features unlock immediately
- [ ] Purchase persists after app restart
- [ ] Purchase restoration works (reinstall app)
- [ ] Offline behavior tested (airplane mode)
- [ ] Error handling tested (network failure, cancelled purchase)

## iOS IAP Testing (App Store)

### 1. App Store Connect Setup

1. **Create the In-App Purchase**
   - Navigate to App Store Connect → Your App → Features → In-App Purchases
   - Click the "+" button
   - Type: Non-Consumable
   - Reference Name: "Premium Unlock"
   - Product ID: `catchlogplus_premium_unlock`
   - Price: 4.99 € (Tier 5 or equivalent)

2. **Configure Product Details**
   - Display Name: "CatchLog+ Premium" (all languages)
   - Description: "Unlock AI insights, exports, and private groups"
   - Add promotional image (optional, 1024x1024px)
   - Submit for review along with app binary

3. **Sandbox Testing Setup**
   - App Store Connect → Users and Access → Sandbox Testers
   - Create test Apple IDs (use unique emails)
   - Note: Do NOT sign into these accounts in iOS Settings
   - Use them only when prompted during IAP testing

### 2. Testing Procedures (iOS)

#### Sandbox Testing

1. **Device Preparation**
   - Ensure device is NOT signed into a production Apple ID for StoreKit
   - If signed in, sign out: Settings → App Store → Apple ID → Sign Out
   - Keep a list of sandbox tester credentials handy

2. **Testing Steps**
   ```
   1. Install the app via TestFlight or Xcode
   2. Launch the app and navigate to premium features
   3. Tap "Upgrade to Premium" button
   4. System will prompt for Apple ID credentials
   5. Enter sandbox tester Apple ID and password
   6. Confirm the purchase dialog (shows [Sandbox])
   7. Complete purchase (no charge applied)
   8. Verify premium features unlock
   9. Kill and relaunch the app
   10. Verify purchase persists
   ```

3. **Test Purchase Restoration**
   - Delete and reinstall the app
   - Launch app and tap "Restore Purchases"
   - Verify premium features unlock automatically

4. **Test Multiple Devices**
   - Sign in with same sandbox tester on different device
   - Restore purchases
   - Verify premium access is granted

#### Common iOS Issues

**Issue**: "Cannot connect to iTunes Store"
- **Fix**: Ensure you're using a sandbox tester account, not production
- **Fix**: Check network connectivity
- **Fix**: Sign out of production Apple ID in Settings → App Store

**Issue**: Purchase doesn't show [Sandbox] label
- **Fix**: You're using a production account—switch to sandbox tester
- **Fix**: Sign out of App Store in device Settings

**Issue**: "This Apple ID has not yet been used in the iTunes Store"
- **Fix**: Complete sandbox account setup by tapping through the prompts
- **Fix**: Accept terms and conditions when prompted

**Issue**: Receipt validation fails
- **Fix**: Use sandbox receipt validation endpoint in development:
  - Sandbox: `https://sandbox.itunes.apple.com/verifyReceipt`
  - Production: `https://buy.itunes.apple.com/verifyReceipt`

### 3. Testing Checklist (iOS)

- [ ] Product created in App Store Connect
- [ ] Sandbox tester accounts created
- [ ] App installed via TestFlight or Xcode
- [ ] Purchase dialog shows [Sandbox] label
- [ ] Purchase completes successfully
- [ ] Premium features unlock immediately
- [ ] Purchase persists after app restart
- [ ] Purchase restoration works (reinstall)
- [ ] Multiple device restoration tested
- [ ] Offline behavior tested
- [ ] Error handling tested (cancelled purchase, network failure)

## General Testing Best Practices

### Feature Flag Implementation

Ensure IAP code is guarded behind feature flags:

```typescript
// Example feature flag pattern
const IAP_ENABLED = __DEV__ ? false : true;

if (IAP_ENABLED) {
  // Initialize IAP SDK
  // Show premium upgrade UI
}
```

### CI/CD Considerations

- IAP tests should NOT run in CI/CD pipelines
- Mock IAP responses for automated testing
- Use dependency injection to swap real IAP with mock implementation
- Example environment check:
  ```typescript
  const isCI = process.env.CI === 'true';
  const iapService = isCI ? new MockIAPService() : new RealIAPService();
  ```

### Testing Matrix

Test all scenarios in this matrix:

| Scenario | Android | iOS | Notes |
|----------|---------|-----|-------|
| Fresh install → Purchase | ✓ | ✓ | Normal flow |
| Purchase → Restart app | ✓ | ✓ | Persistence check |
| Uninstall → Reinstall → Restore | ✓ | ✓ | Restoration flow |
| Purchase on Device A → Restore on Device B | ✓ | ✓ | Multi-device sync |
| Airplane mode → Attempt purchase | ✓ | ✓ | Offline handling |
| Cancel purchase dialog | ✓ | ✓ | User cancellation |
| Network failure during purchase | ✓ | ✓ | Error handling |
| Already purchased → Attempt repurchase | ✓ | ✓ | Duplicate prevention |

### Logging and Debugging

Enable verbose IAP logging during testing:

```typescript
// Example logging pattern
console.log('[IAP] Initializing purchase flow');
console.log('[IAP] Product ID:', productId);
console.log('[IAP] User action:', action);
console.log('[IAP] Purchase result:', result);
```

For production builds, disable verbose logs or use a logging service like Sentry.

## Pre-Release Validation

Before submitting to stores, complete this final checklist:

### Android
- [ ] Test with multiple Google accounts
- [ ] Test on various Android versions (min API 21)
- [ ] Verify purchase on slow network
- [ ] Test with VPN enabled
- [ ] Confirm proper error messages shown to users
- [ ] Review Play Console crash reports

### iOS
- [ ] Test with multiple sandbox accounts
- [ ] Test on various iOS versions (min iOS 13)
- [ ] Verify purchase on slow network
- [ ] Test with VPN enabled
- [ ] Confirm proper error messages shown to users
- [ ] Review TestFlight crash reports

### Both Platforms
- [ ] Premium features properly locked/unlocked
- [ ] UI clearly indicates premium vs free features
- [ ] "Restore Purchases" button is accessible
- [ ] Terms of service and privacy policy links present
- [ ] Purchase confirmation clearly states it's non-refundable
- [ ] App doesn't crash if IAP service unavailable
- [ ] Graceful degradation when offline

## Documentation and Resources

### Android Resources
- [Google Play Billing Library](https://developer.android.com/google/play/billing)
- [Test in-app purchases](https://developer.android.com/google/play/billing/test)
- [Play Console Help](https://support.google.com/googleplay/android-developer)

### iOS Resources
- [StoreKit Documentation](https://developer.apple.com/documentation/storekit)
- [Testing In-App Purchases](https://developer.apple.com/documentation/storekit/in-app_purchase/testing_in-app_purchases)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)

### Expo/React Native IAP
- [Expo IAP Module](https://docs.expo.dev/versions/latest/sdk/in-app-purchases/)
- [react-native-iap](https://github.com/dooboolab/react-native-iap) (if not using Expo managed)

## Support and Troubleshooting

If you encounter issues not covered in this guide:

1. Check platform-specific console (Play Console, App Store Connect)
2. Review device logs (adb logcat for Android, Console.app for iOS)
3. Verify IAP library version compatibility
4. Check network proxy/firewall settings
5. Consult platform-specific developer forums

## Version History

- **v1.0** (2025-11-09): Initial IAP testing documentation
  - Android sandbox setup
  - iOS sandbox setup
  - Testing procedures and checklists
  - Common issues and troubleshooting

---

**Note**: Always test IAP functionality thoroughly before releasing to production. IAP bugs can significantly impact revenue and user experience.
