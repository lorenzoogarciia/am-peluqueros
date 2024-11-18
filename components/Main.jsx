import React, { useState } from "react";
import { Screen } from "./common/Screen";
import Logo from "./common/Logo";
import { TextInput, Pressable, View, Text, Alert } from "react-native";
import { styled } from "nativewind";
import { Link } from "expo-router";
import { useRouter } from "expo-router";
import { loginUser } from "../app/services/authService";

export default function Main() {
  const StyledPressable = styled(Pressable);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const { role } = await loginUser(email, password);
      clearFields();

      // Redirigir según el rol del usuario
      if (role === "barber") {
        router.push("./peluqueros/barberHome");
      } else if (role === "client") {
        router.push("./clientes/clientHome");
      }
    } catch (error) {
      Alert.alert(error.message || "Error al iniciar sesión");
    }
  };

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
