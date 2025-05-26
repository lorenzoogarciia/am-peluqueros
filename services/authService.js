import { auth, firestore } from "../app/firebase/config";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

// Iniciar sesión con Firebase
export const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new Error("Por favor, rellene todos los campos");
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    // Guardar el token del usuario o sus datos en AsyncStorage
    await AsyncStorage.setItem("userToken", user.uid);
    console.log("email: ", user.email);

    // Verificar si es peluquero
    const barberDoc = await getDoc(doc(firestore, "peluqueros", email));
    if (barberDoc.exists()) {
      return { role: "barber", user };
    }

    // Verificar si es cliente
    const clientDoc = await getDoc(doc(firestore, "clientes", email));
    if (clientDoc.exists()) {
      return { role: "client", user };
    }

    throw new Error("Usuario no encontrado");
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw new Error(error.message || "Error al iniciar sesión");
  }
};

// Verificar sesión existente
export const checkSession = () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          console.log("No hay usuario autenticado");
          resolve(null);
          return;
        }

        console.log("Usuario autenticado:", user.email);

        // Verificar si el usuario es peluquero
        const barberDoc = await getDoc(
          doc(firestore, "peluqueros", user.email),
        );
        if (barberDoc.exists()) {
          resolve({ role: "barber", user });
          return;
        }

        // Verificar si el usuario es cliente
        const clientDoc = await getDoc(doc(firestore, "clientes", user.email));
        if (clientDoc.exists()) {
          resolve({ role: "client", user });
          return;
        }

        // Si no es ni peluquero ni cliente
        resolve(null);
      } catch (error) {
        console.error("Error al verificar la sesión:", error);
        reject(error);
      }
    });
  });
};

// Cerrar sesión y limpiar AsyncStorage
export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem("userToken");
    await auth.signOut();
    router.replace("/login");
    console.log("Sesión cerrada");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};

export default {};
