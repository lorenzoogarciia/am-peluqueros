import { Drawer } from "expo-router/drawer";
import { TouchableOpacity } from "react-native";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  CalendarIcon,
  ClientsIcon,
  HomeIcon,
  ProductsIcon,
  ProfileIcon,
  SignOutIcon,
  DrawerIcon,
} from "../../components/common/Icons";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { auth } from "../firebase/config";
import { firestore, storage } from "../firebase/config";
import { getDownloadURL, ref } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";
import { View, Text, Image, ActivityIndicator } from "react-native";
import NoPhoto from "../../assets/usuario-nophoto.png";
import { useEffect, useState } from "react";
import { logoutUser } from "../services/authService";

export default function BarberLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={CustomDrawer}
        screenOptions={({ navigation }) => ({
          drawerHideStatusBarOnOpen: true,
          drawerActiveTintColor: "white",
          drawerInactiveTintColor: "black",
          drawerActiveBackgroundColor: "black",
          drawerInactiveBackgroundColor: "white",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.toggleDrawer()}
              style={{ marginLeft: 10 }}
            >
              <DrawerIcon size={28} color="black" />
            </TouchableOpacity>
          ),
        })}
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
  const bottom = useSafeAreaInsets();
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const mail = auth.currentUser.email;

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
    //Función que obtiene la imagen de perfil del usuario
    const fetchProfileImage = async () => {
      const user = auth.currentUser;
      if (user) {
        const imageRef = ref(storage, `/profileImages/${user.uid}_profile.jpg`);
        try {
          const url = await getDownloadURL(imageRef);
          setProfileImage(url);
        } catch (error) {
          console.log(
            "No se ha podido obtener la imagen de perfil" + error.message,
          );
        }
      }
      setLoading(false);
    };
    fetchProfileImage();
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
          {!loading ? (
            <Image
              source={profileImage ? { uri: profileImage } : NoPhoto}
              style={{
                width: 150,
                height: 150,
                borderRadius: 40,
                paddingBottom: 10,
              }}
              resizeMode="cover"
            />
          ) : (
            <ActivityIndicator size="large" color="black" />
          )}
          <Text className="text-black font-bold pb-1 text-lg">
            {name || "AM Peluqueros"}
          </Text>
          <Text className="text-black pb-1 text-l">{mail || "mail"}</Text>
        </View>
        <DrawerItemList {...props} />
        <DrawerItem
          label={"Cerrar Sesión"}
          labelStyle={{ color: "black" }}
          onPress={logoutUser}
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
