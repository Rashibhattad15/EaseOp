import { SaudaPayload } from "../productConfiguration/SaudaPayload";

// models/Notification.ts
export interface Notification {
    title: string;
    body: string;
    data?: SaudaPayload
  }
  