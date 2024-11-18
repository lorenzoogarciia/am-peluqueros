import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Configuración de Firebase
export const firebaseConfig = {
  apiKey: "AIzaSyBCGr9mJyleM5RIRoYM2vOMv05DaqmMBHY",
  authDomain: "ampeluqeros.firebaseapp.com",
  projectId: "ampeluqeros",
  storageBucket: "ampeluqeros.appspot.com",
  messagingSenderId: "389220204116",
  appId: "1:389220204116:web:1a3bad2f132b12f4b2f7c1",
  measurementId: "G-FXLLZ4S9W7",
};

// Inicializa la app de Firebase
const app = initializeApp(firebaseConfig);

// Servicios de Firebase
const firestore = getFirestore(app);
const storage = getStorage(app);

// Inicializa Auth con persistencia
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth, firestore, storage };
export default {};
