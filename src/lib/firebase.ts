
'use client';

import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getMessaging, type Messaging } from 'firebase/messaging';

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID; // Optional

let app: FirebaseApp | null = null;
let fcm: Messaging | null = null;

// Check if core Firebase config values are present
if (apiKey && projectId && appId && messagingSenderId && authDomain && storageBucket) {
  const firebaseConfig = {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId,
  };

  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
    } catch (e) {
      console.error("Firebase initialization failed:", e);
      // app remains null
    }
  } else {
    app = getApp();
  }

  // Initialize Messaging only if app was successfully initialized and on client
  if (app && typeof window !== 'undefined') {
    try {
      fcm = getMessaging(app);
    } catch (error) {
      console.error("Firebase Messaging initialization failed:", error);
      // fcm remains null
    }
  }
} else {
  console.warn(
    "Essential Firebase configuration (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId) is missing. " +
    "Firebase SDK will not be initialized. Please check your .env file with NEXT_PUBLIC_ prefixed variables."
  );
}

// Export a function that returns the potentially initialized messaging instance
const getFirebaseMessaging = (): Messaging | null => {
  return fcm;
};

// Export the app instance (can be null if initialization failed or config was missing)
export { app, getFirebaseMessaging };
