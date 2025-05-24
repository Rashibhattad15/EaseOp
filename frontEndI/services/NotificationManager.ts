// services/NotificationService.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import httpClient from './httpClient';
import { endpoints } from './api';

class NotificationService {
  static async init(idToken: string) {
    if (Platform.OS !== 'android') {
      console.log('Notifications only enabled for Android');
      return;
    }

    console.log(idToken, 'idToken in NotificationService init method');

    // const isPhysicalDevice = Device.isDevice;
    // if (!isPhysicalDevice) {
    //   console.warn('Must use physical device for push notifications');
    //   return;
    // }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Failed to get push token for push notification!');
      return;
    }

    try{
      const expoPushToken = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Expo Push Token:', expoPushToken);

      const fcmToken = await Notifications.getDevicePushTokenAsync();
      console.log('FCM Token:', fcmToken.data);

      console.log('Sending authorization access token to backend:', idToken);
  
      // Send the token to your backend server
      await httpClient.post(endpoints.notificationManager.subscribeToAdmin, {
        fcmToken: expoPushToken,
        idToken
      });
    } catch (error: any) {
      console.error('Error getting Expo push token:', error.message);
      console.error('Error stack:', error.stack);
    }
    

    // Foreground notifications
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    // Listener for received notifications
    Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received in foreground:', notification);
    });

    // Listener for user tapping on notification
    Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapped:', response);
    });

  }


  //TODO: Implement unsubscribeFromNotifications
  //remove the token from the backend
  static unsubscribeFromNotfications = async (idToken: string) => {
  }
}


export default NotificationService
