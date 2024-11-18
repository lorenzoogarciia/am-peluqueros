import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { checkSession } from "./services/authService";
import { View, ActivityIndicator } from "react-native";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeSession = async () => {
      const session = await checkSession();
      if (session) {
        if (session.role === "barber") {
          router.replace("/peluqueros/barberHome");
        } else if (session.role === "client") {
          router.replace("/clientes/clientHome");
        }
      } else {
        router.replace("/login");
      }
      setIsLoading(false);
    };

    initializeSession();
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null; // No se renderiza nada ya que redirige automáticamente
};

export default Index;
