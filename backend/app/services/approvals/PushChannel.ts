// services/PushChannel.ts
import { NotificationChannel } from "./NotificationChannel";
import { Notification } from "../../../../commons/models/notification/Notification";
import admin from "firebase-admin";

export class PushChannel implements NotificationChannel {

// When user logs in or registers on client side
// call your backend API: POST /register-fcm-token

// This function should be called when the user logs in or registers
// and you want to register the FCM token for a specific topic
async registerFcmToken(topic: string, fcmToken: string): Promise<void> {
  const db = admin.database();
  const ref = db.ref(`fcmTopics/${topic}/tokens`);

  try {
    // Fetch current tokens
    const snapshot = await ref.once('value');
    const currentTokens: string[] = snapshot.val() || [];

    if (!currentTokens.includes(fcmToken)) {
      currentTokens.push(fcmToken);
      await ref.set(currentTokens);
      console.log(`Token registered for topic: ${topic}`);
    } else {
      console.log(`Token already exists for topic: ${topic}`);
    }
  } catch (error) {
    console.error('Error registering FCM token in Realtime DB:', error);
    throw error;
  }
}


async sendToTopic(topic: string, notification: Notification): Promise<void> {
  const db = admin.database();
  const ref = db.ref(`fcmTopics/${topic}/tokens`);

  try {
    // Retrieve all tokens for the given topic from Firebase Realtime Database
    const snapshot = await ref.once('value');
    const tokens: string[] = snapshot.val() || [];

    if (tokens.length === 0) {
      console.warn(`No tokens found for topic: ${topic}`);
      return;
    }

    const responses = await Promise.all(
      tokens.map(async (token) => {
        try {
          // Construct the message to be sent via Expo's push notification API
          const message = {
            to: token,
            title: notification.title,
            body: notification.body,
            data: notification.data || {},
          };

          // Send the notification using Expo Push API
          const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
          });

          const result = await response.json();

          if (result.data.status === 'ok') {
            return { success: true, token };
          } else {
            console.error(`Error sending to token ${token}:`, result);
            return { success: false, token };
          }
        } catch (error) {
          console.error(`Error sending to token ${token}:`, error);
          return { success: false, token };
        }
      })
    );

    // Count successes and failures
    const successCount = responses.filter(res => res.success).length;
    const failureCount = responses.length - successCount;

    console.log(`Sent to topic ${topic}. Success: ${successCount}, Failures: ${failureCount}`);

    if (failureCount > 0) {
      const failedTokens = responses.filter(r => !r.success).map(r => r.token);
      console.warn('Failed tokens:', failedTokens);

      // Optional: Remove failed tokens from DB
      // const updatedTokens = tokens.filter(token => !failedTokens.includes(token));
      // await ref.set(updatedTokens);
    }

  } catch (error) {
    console.error('Error sending notification to topic:', error);
    throw error;
  }
}


  
}
