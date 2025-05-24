import { Notification } from "../../../../commons/models/notification/Notification";

export interface NotificationChannel {
    sendToTopic(topic: string, notification: Notification): Promise<void>;

    registerFcmToken(topic: string, fcmToken: string): Promise<void>;

    // subscribeToTopic(topic: string, fcmToken: string): Promise<void>;
  }
  