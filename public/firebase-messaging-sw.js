
// Scripts for Firebase v9 Modular SDK
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// !!! IMPORTANT: Replace this with your Firebase project's configuration object !!!
// This configuration MUST be present for the service worker to initialize Firebase Messaging.
// You can find this in your Firebase project settings:
// Project settings > General > Your apps > Web app > Firebase SDK snippet > Config
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY_SW",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN_SW",
  projectId: "YOUR_FIREBASE_PROJECT_ID_SW",
  storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET_SW",
  messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID_SW",
  appId: "YOUR_FIREBASE_APP_ID_SW",
  measurementId: "YOUR_FIREBASE_MEASUREMENT_ID_SW" // Optional
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}


const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification?.title || 'New Message';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new message.',
    icon: payload.notification?.icon || '/icons/icon-192x192.png' // Ensure you have an icon here
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  console.log('[firebase-messaging-sw.js] Notification click Received.', event.notification.data);
  event.notification.close();
  // Add logic to open a specific page or focus the app window
  // For example:
  // event.waitUntil(
  //   clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
  //     if (clientList.length > 0) {
  //       let client = clientList[0];
  //       for (let i = 0; i < clientList.length; i++) {
  //         if (clientList[i].focused) {
  //           client = clientList[i];
  //         }
  //       }
  //       return client.focus();
  //     }
  //     return clients.openWindow('/'); // Open a default page if app is not open
  //   })
  // );
});
