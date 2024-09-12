import { Drawer } from "expo-router/drawer";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  CalendarIcon,
  ClientsIcon,
  HomeIcon,
  ProductsIcon,
  ProfileIcon,
  SignOutIcon,
} from "../../components/common/Icons";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { auth } from "../../firebase/config";
import { firestore } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { Alert, View, Text, Image } from "react-native";
import NoPhoto from "../../assets/usuario-nophoto.png";
import { useEffect, useState } from "react";

export default function BarberLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={CustomDrawer}
        screenOptions={{
          drawerHideStatusBarOnOpen: true,
          drawerActiveTintColor: "white",
          drawerInactiveTintColor: "black",
          drawerActiveBackgroundColor: "black",
          drawerInactiveBackgroundColor: "white",
        }}
      >
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
          name="citas"
          options={{
            drawerLabel: "Citas",
            title: "Citas Agendadas",
            drawerIcon: ({ size, color }) => (
              <CalendarIcon size={size} color={color} />
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
        <Drawer.Screen
          name="productos"
          options={{
            drawerLabel: "Productos",
            title: "Productos",
            drawerIcon: ({ size, color }) => (
              <ProductsIcon size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

function CustomDrawer(props) {
  const router = useRouter();
  const bottom = useSafeAreaInsets();
  const [name, setName] = useState("");
  const mail = auth.currentUser.email;

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.navigate("/");
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Error",
        "Ocurrió un error al cerrar sesión: ",
        error.message,
      );
    }
  };

  const handleGetNames = async () => {
    try {
      const docRef = doc(firestore, "peluqueros", mail);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setName(docSnap.data().name);
      } else {
        console.log("No se encuentra el documento");
      }
    } catch (error) {
      console.error("Error getting document:", error);
    }
  };

  useEffect(() => {
    handleGetNames();
  });

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        scrollEnabled={false}
        contentContainerStyle={{
          backgroundColor: "white",
        }}
      >
        <View className="pb-3">
          <Image
            source={NoPhoto}
            style={{
              width: "50%",
              height: 100,
            }}
            resizeMode="contain"
          />
          <Text className="text-black font-bold pl-3 pb-1">
            {name || "AM Peluqueros"}
          </Text>
          <Text className="text-black pl-3">{mail || "mail"}</Text>
        </View>
        <DrawerItemList {...props} />
        <DrawerItem
          label={"Cerrar Sesión"}
          labelStyle={{ color: "black" }}
          onPress={handleSignOut}
          icon={({ size }) => <SignOutIcon size={size} color="black" />}
        />
      </DrawerContentScrollView>

      <View
        style={{
          backgroundColor: "white",
          borderTopWidth: 1,
          padding: 20,
          paddingBottom: 10 + bottom.bottom,
        }}
      >
        <Text className="text-black font-bold">AM Peluqueros. 2024</Text>
      </View>
    </View>
  );
}
