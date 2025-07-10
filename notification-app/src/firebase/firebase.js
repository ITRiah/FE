import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyChG555tHVlct1JFBdTCFHiz1-vRqEE5cs",
  authDomain: "noti-app-5f5fc.firebaseapp.com",
  projectId: "noti-app-5f5fc",
  storageBucket: "noti-app-5f5fc.firebasestorage.app",
  messagingSenderId: "310800300484",
  appId: "1:310800300484:web:68002dc46004b2c6944c91",
  measurementId: "G-SDT9YRJRLT"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };