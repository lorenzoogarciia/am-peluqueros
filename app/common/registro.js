import Logo from "../../components/common/Logo";
import { BackIcon } from "../../components/common/Icons";
import { Screen } from "../../components/common/Screen";
import { Stack, Link, router } from "expo-router";
import {
  ScrollView,
  TouchableOpacity,
  View,
  TextInput,
  Dimensions,
  Pressable,
  Text,
  Alert,
} from "react-native";
import { styled } from "nativewind";
import { useState } from "react";
import { auth } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const { width } = Dimensions.get("window");

export default function Registro() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const StyledPressable = styled(Pressable);

  const handleRegister = async () => {
    if (email && password.length >= 6 && name && lastName && phone) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);

        const firestore = getFirestore();
        const userDocRef = doc(firestore, "clientes", email);

        await setDoc(userDocRef, {
          email,
          name,
          lastName,
          phone,
        });

        Alert.alert("Registro exitoso");
        router.back();
      } catch (error) {
        console.error("Error al registrar usuario: ", error);
        Alert.alert("Error al registrar usuario", error.message);
      }
    } else {
      Alert.alert(
        "Por favor, rellene todos los campos. La contraseña debe tener al menos 6 caracteres",
      );
    }
  };

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "white" },
          headerTintColor: "#black",
          headerTitle: "Registro",
          headerLeft: () => {
            return (
              <TouchableOpacity onPress={() => router.back()}>
                <BackIcon />
              </TouchableOpacity>
            );
          },
          headerRight: () => {
            return (
              <Link href={"/"}>
                <Logo />
              </Link>
            );
          },
        }}
      />
      <ScrollView>
        <View style={{ width }} className="items-center justify-center p-5">
          <TextInput
            style={{
              height: 60,
              borderColor: "black",
              borderWidth: 1,
              width: "95%",
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
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            style={{
              height: 60,
              borderColor: "black",
              borderWidth: 1,
              width: "95%",
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
          <TextInput
            style={{
              height: 60,
              borderColor: "black",
              borderWidth: 1,
              width: "95%",
              margin: 10,
              color: "black",
              backgroundColor: "white",
              borderRadius: 8,
              alignSelf: "center",
              padding: 2,
              fontSize: 16,
            }}
            placeholder="Nombre"
            placeholderTextColor={"black"}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={{
              height: 60,
              borderColor: "black",
              borderWidth: 1,
              width: "95%",
              margin: 10,
              color: "black",
              backgroundColor: "white",
              borderRadius: 8,
              alignSelf: "center",
              padding: 2,
              fontSize: 16,
            }}
            placeholder="Apellidos"
            placeholderTextColor={"black"}
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={{
              height: 60,
              borderColor: "black",
              borderWidth: 1,
              width: "95%",
              margin: 10,
              color: "black",
              backgroundColor: "white",
              borderRadius: 8,
              alignSelf: "center",
              padding: 2,
              fontSize: 16,
            }}
            placeholder="Teléfono"
            placeholderTextColor={"black"}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <StyledPressable
            style={{ backgroundColor: "black", width: "60%" }}
            className="rounded-2xl active:opacity-80 p-2 items-center mt-2"
            onPress={handleRegister}
          >
            <Text className="text-white text-lg">Registrarse</Text>
          </StyledPressable>
        </View>
        <View className="items-center">
          <Logo width={"70%"} height={"50%"} />
        </View>
      </ScrollView>
    </Screen>
  );
}
