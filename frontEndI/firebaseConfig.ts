// Import necessary Firebase modules
import { initializeApp,getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDjrxPiau4SOEqpNczV3MJksfYh4qLWIJU",
  authDomain: "firbaseauth-3356e.firebaseapp.com",
  databaseURL: "https://firbaseauth-3356e-default-rtdb.firebaseio.com",
  projectId: "firbaseauth-3356e",
  storageBucket: "firbaseauth-3356e.appspot.com",
  appId: "1:857288419045:android:5463394bca8a48a757d60c"
};

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}
// Initialize Firebase Authentication
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Firestore & Storage
const realtimedb = getDatabase(); 
const storage = getStorage(app);
// const messaging = getMessaging(app);
// Initialize Firebase Messaging  

// Export instances
export { app, auth, realtimedb, storage };
