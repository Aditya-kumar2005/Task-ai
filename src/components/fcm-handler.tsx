
'use client';

import { useEffect } from 'react';
import { getFirebaseMessaging } from '@/lib/firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { useToast } from '@/hooks/use-toast';

export function FcmHandler() {
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const messagingInstance = getFirebaseMessaging();

      if (!messagingInstance) {
        // console.error('Firebase Messaging not initialized or unavailable. Cannot request token or listen for messages.');
        // No need to log an error here if firebase.ts already warns about missing config.
        // If it's truly an unexpected issue beyond config, other logs would show it.
        return;
      }

      const requestPermissionAndToken = async () => {
        try {
          console.log('Requesting notification permission...');
          const permission = await Notification.requestPermission();
          
          if (permission === 'granted') {
            console.log('Notification permission granted.');
            
            const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
            if (!vapidKey) {
              console.error('VAPID key not found. Set NEXT_PUBLIC_FIREBASE_VAPID_KEY in .env');
              return;
            }

            // Register service worker explicitly if not already registered
            navigator.serviceWorker.register('/firebase-messaging-sw.js')
              .then(async (registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
                
                console.log('Getting FCM token...');
                const currentToken = await getToken(messagingInstance, { 
                  vapidKey: vapidKey,
                  serviceWorkerRegistration: registration 
                });

                if (currentToken) {
                  console.log('FCM Token:', currentToken);
                  // TODO: Send this token to your server to store it and send notifications
                  // Example: await sendTokenToServer(currentToken);
                } else {
                  console.log('No registration token available. Request permission to generate one.');
                }
              }).catch((err) => {
                console.error('Service Worker registration failed:', err);
              });

          } else {
            console.log('Unable to get permission to notify.');
          }
        } catch (error) {
          console.error('An error occurred while retrieving token or requesting permission. ', error);
        }
      };

      requestPermissionAndToken();

      // Handle foreground messages
      const unsubscribeOnMessage = onMessage(messagingInstance, (payload) => {
        console.log('Message received in foreground. ', payload);
        toast({
          title: payload.notification?.title || 'New Message',
          description: payload.notification?.body || '',
        });
      });

      return () => {
        unsubscribeOnMessage(); // Unsubscribe when component unmounts
      };
    }
  }, [toast]);

  return null; // This component does not render anything
}
