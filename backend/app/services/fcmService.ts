import admin from 'firebase-admin';
import { SaudaPayload } from '../../../commons/models/productConfiguration/SaudaPayload';

const topic = 'admin_approval';

export const sendSaudaApprovalNotification = async (payload: SaudaPayload) => {
  const message = {
    notification: {
      title: 'New Sauda Approval Needed',
      body: `${payload.customer?.firstName} ${payload.customer?.lastName} placed a Sauda for ${payload.quantity} ${payload.quantityUnit} @ ${payload.rate}`,
    },
    data: {
      type: 'SAUDA_APPROVAL',
      sauda: JSON.stringify(payload),
    },
    topic,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};
