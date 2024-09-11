import { initializeAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getReactNativePersistence } from "firebase/auth/react-native";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

//Configuracion de Firebase
export const firebaseConfig = {
  apiKey: "AIzaSyBCGr9mJyleM5RIRoYM2vOMv05DaqmMBHY",
  authDomain: "ampeluqeros.firebaseapp.com",
  projectId: "ampeluqeros",
  storageBucket: "ampeluqeros.appspot.com",
  messagingSenderId: "389220204116",
  appId: "1:389220204116:web:1a3bad2f132b12f4b2f7c1",
  measurementId: "G-FXLLZ4S9W7",
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth, firestore, storage };
