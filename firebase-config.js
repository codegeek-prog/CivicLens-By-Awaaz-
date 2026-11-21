/**
 * CivicLens - Firebase Configuration
 * 
 * Replace the values below with your Firebase project credentials from the
 * Firebase Console (Project Settings -> General -> Your apps -> Web app).
 */

const firebaseConfig = {
  apiKey: "AIzaSyDemoKeyCivicLens2026_ReplaceWithYourKey",
  authDomain: "civiclens-awaaz.firebaseapp.com",
  projectId: "civiclens-awaaz",
  storageBucket: "civiclens-awaaz.appspot.com",
  messagingSenderId: "109876543210",
  appId: "1:109876543210:web:9876543210abcdef"
};

// Export for module systems if applicable
if (typeof module !== 'undefined' && module.exports) {
  module.exports = firebaseConfig;
}
