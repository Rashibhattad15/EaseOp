import admin, { ServiceAccount } from 'firebase-admin';
import serviceAccount from '../../serviceAccountKey.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
  databaseURL: "https://firbaseauth-3356e-default-rtdb.firebaseio.com",
  storageBucket: "firbaseauth-3356e.appspot.com",
  projectId: "firbaseauth-3356e"
});


export const messaging = admin.messaging();
export const db = admin.firestore();

export default admin;
