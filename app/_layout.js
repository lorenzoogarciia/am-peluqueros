import { Stack } from "expo-router";

//Layout por defecto de la aplicación
export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "white" },
        headerTitle: "AM Peluqueros",
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="peluqueros" options={{ headerShown: false }} />
      <Stack.Screen name="clientes" options={{ headerShown: false }} />
    </Stack>
  );
}
