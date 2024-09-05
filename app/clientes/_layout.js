import "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  HomeIcon,
  ProfileIcon,
  DetailsIcon,
  SignOutIcon,
} from "../../components/common/Icons";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { auth } from "../../firebase/config";
import { Alert, View, Text, Image } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NoPhoto from "../../assets/usuario-nophoto.png";
import { useEffect, useState } from "react";
import { firestore } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";

export default function ClientLayout() {
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
          name="clientHome"
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
          name="detalles"
          options={{
            drawerLabel: "Detalles",
            title: "Detalles",
            drawerIcon: ({ size, color }) => (
              <DetailsIcon size={size} color={color} />
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
      const docRef = doc(firestore, "clientes", mail);
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
            {name || "Nombre"}
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
