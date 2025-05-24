import { NotificationChannel } from './NotificationChannel';
import { Notification } from '../../../../commons/models/notification/Notification';
import admin from '../../config/firebase';
import AWS from 'aws-sdk';

export class NotificationService {
    constructor(private notificationChannel: NotificationChannel) {}

    ADMIN_APPROVAL_TOPIC = "ADMIN_APPROVAL";

    async subscribeForAdminNotification(fcmToken: string, idToken: string){
        try{
            const decoded = await admin.auth().verifyIdToken(idToken);
            console.log(`Verified user: ${decoded.uid}`);

            await this.notificationChannel.registerFcmToken(this.ADMIN_APPROVAL_TOPIC, fcmToken)
            console.log(`Subscribed to topic: ${this.ADMIN_APPROVAL_TOPIC}`);
        }catch(error: any){
            console.error(`Failed to subscribe to topic: ${this.ADMIN_APPROVAL_TOPIC} for user: ${error.message}`);
        }
    }

    async sendNotificationToTopic(topic: string, notification: Notification){
        try {
            await this.notificationChannel.sendToTopic(topic, notification);
            console.log(`Notification sent to topic: ${topic}`);
        } catch (error) {
            console.error(`Failed to send notification to topic ${topic}`, error);
            throw error;
        }
    }

    async notifyAdmins(notification: Notification) {
        await this.notificationChannel.sendToTopic(this.ADMIN_APPROVAL_TOPIC, notification);
      }
}