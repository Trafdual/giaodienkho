import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, push,set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBG3ReVfhqDDn-Ocd_aTvON8vBAcHXdduc",
  authDomain: "chat-app-ceb82.firebaseapp.com",
  databaseURL: "https://chat-app-ceb82-default-rtdb.firebaseio.com",
  projectId: "chat-app-ceb82",
  storageBucket: "chat-app-ceb82.firebasestorage.app",
  messagingSenderId: "268815395218",
  appId: "1:268815395218:web:f4afe468507bd19debb94b"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
export { db, ref, onValue, push, set };
