import { Drawer } from "expo-router/drawer";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  ClientsIcon,
  HomeIcon,
  ProfileIcon,
} from "../../components/common/Icons";

export default function BarberLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="barberHome"
          options={{
            drawerLabel: "Inicio",
            title: "Inicio",
            drawerIcon: ({ size, color }) => (
              <HomeIcon size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="perfil"
          options={{
            drawerLabel: "Perfil",
            title: "Perfil",
            drawerIcon: ({ size, color }) => (
              <ProfileIcon size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="clientes"
          options={{
            drawerLabel: "Clientes",
            title: "Clientes",
            drawerIcon: ({ size, color }) => (
              <ClientsIcon size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
