import {Response, Request} from 'express';
import {NotificationService} from '../services/approvals/NotificationService';
import { PushChannel } from '../services/approvals/PushChannel';
import { Notification } from '../../../commons/models/notification/Notification';


    const pushChannel = new PushChannel();
    const notificationService = new NotificationService(pushChannel);
        

export const notifyAdmins = async(req: Request<{}, {}, Notification>, res: Response) => {
    const { title, body, data } = req.body;

    try{
        await notificationService.notifyAdmins({ title, body, data });
        console.log("Notification sent to admins: ", { title, body, data });
        res.status(200).json({message: 'Notification sent to admins'});
    }catch(error){
        console.error('Error sending notification to admins:', error);
        res.status(500).json({error: 'Failed to send notification'});
    }
}

export const subscribeToAdmin = async(req:Request, res: Response) => {
    try{
        const{fcmToken, idToken} = req.body;
        await notificationService.subscribeForAdminNotification(fcmToken, idToken);
        res.status(200).json({message: 'Subscribed to admin notification'});
    }catch(error: any){
        console.error('Error subscribing to admin topic:', error.message);
        res.status(500).json({error: 'Failed to subscribe to admin'});
    }
}