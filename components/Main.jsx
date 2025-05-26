import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Screen } from "./common/Screen";
import Logo from "./common/Logo";
import { TextInput, Pressable, View, Text, Alert } from "react-native";
import { styled } from "nativewind";
import { Link } from "expo-router";
import { useRouter } from "expo-router";
import { loginUser } from "../services/authService";

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
          style={styles.inputs}
          placeholder="Correo electrónico"
          placeholderTextColor={"black"}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          autoCorrect={false}
          textContentType="emailAddress"
          textInputMode="email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.inputs}
          placeholder="Contraseña"
          placeholderTextColor={"black"}
          secureTextEntry={true}
          textContentType="password"
          autoCapitalize="none"
          autoComplete="password"
          autoCorrect={false}
          value={password}
          onChangeText={setPassword}
        />
        <View
          className="flex-col justify-center items-center p-2 gap-2 mt-1"
          style={{ width: "75%" }}
        >
          <StyledPressable
            className="rounded-2xl active:opacity-60 p-3 items-center bg-white border-2 border-black min-w-[75%]"
            onPress={handleSignIn}
          >
            <Text className="text-black text-xl font-bold">Iniciar sesión</Text>
          </StyledPressable>
          <Link asChild href={"../common/registro"}>
            <StyledPressable className="rounded-2xl active:opacity-60 items-center p-3 bg-white border-2 border-black min-w-[75%]">
              <Text className="text-black text-xl font-bold">Registro</Text>
            </StyledPressable>
          </Link>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  inputs: {
    height: "9%",
    borderColor: "black",
    borderWidth: 2,
    width: "75%",
    margin: 10,
    color: "black",
    backgroundColor: "white",
    borderRadius: 8,
    alignSelf: "center",
    padding: 4,
    fontSize: 16,
  },
});
