import { Screen } from "./common/Screen";
import Logo from "./common/Logo";
import { TextInput, Pressable, View, Text } from "react-native";
import { styled } from "nativewind";
import { Link } from "expo-router";
import { auth, firestore } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export function Main() {
  const StyledPressable = styled(Pressable);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  //Función que maneja el inicio de sesión en Firebase
  const handleSignIn = async () => {
    if (email && password) {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const user = userCredential.user;
        console.log("Usuario", user);

        //Verificamos si el usuario está en la colección peluqueros
        const barberDoc = await getDoc(doc(firestore, "peluqueros", email));
        if (barberDoc.exists()) {
          clearFields();
          router.push("/peluqueros/barberHome");
          return;
        }

        //Verificamos si el usuario está en la colección peluqueros
        const clientDoc = await getDoc(doc(firestore, "clientes", email));
        if (clientDoc.exists()) {
          clearFields();
          router.push("/clientes/clientHome");
          return;
        }

        //Si no está en ninguna colección, mostramos un error
        Alert.alert("Usuario no encontrado");
      } catch (error) {
        console.error("Error al iniciar sesión: ", error);
        Alert.alert("Por favor, revise sus credenciales");
      }
    } else {
      Alert.alert("Por favor, rellene todos los campos");
    }
  };

  //Función que limpia los campos de texto
  const clearFields = () => {
    setEmail("");
    setPassword("");
  };

  return (
    <Screen>
      <View style={{ width: "100%" }} className="items-center justify-center">
        <Logo width={"70%"} height={"40%"} />
        <TextInput
          style={{
            height: 50,
            borderColor: "black",
            borderWidth: 1,
            width: "75%",
            margin: 10,
            color: "black",
            backgroundColor: "white",
            borderRadius: 8,
            alignSelf: "center",
            padding: 2,
            fontSize: 16,
          }}
          placeholder="Correo electrónico"
          placeholderTextColor={"black"}
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={{
            height: 50,
            borderColor: "black",
            borderWidth: 1,
            width: "75%",
            margin: 10,
            color: "black",
            backgroundColor: "white",
            borderRadius: 8,
            alignSelf: "center",
            padding: 2,
            fontSize: 16,
          }}
          placeholder="Contraseña"
          placeholderTextColor={"black"}
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <View
          className="flex-row justify-center items-center p-2 mt-1"
          style={{ width: "75%" }}
        >
          <StyledPressable
            className="rounded-3xl active:opacity-80 mr-2 p-3 items-center"
            style={{ backgroundColor: "black" }}
            onPress={handleSignIn}
          >
            <Text className="text-white text-xl font-bold">Iniciar sesión</Text>
          </StyledPressable>
          <Link asChild href={"../common/registro"}>
            <StyledPressable
              className="rounded-3xl active:opacity-80 ml-2 items-center p-3"
              style={{ backgroundColor: "black" }}
            >
              <Text className="text-white text-xl font-bold">Registro</Text>
            </StyledPressable>
          </Link>
        </View>
      </View>
    </Screen>
  );
}
