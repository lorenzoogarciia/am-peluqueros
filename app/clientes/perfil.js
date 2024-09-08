import {
  Image,
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Text,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import NoPhoto from "../../assets/usuario-nophoto.png";
import { styled } from "nativewind";
import ModalAddProfileImage from "../../components/common/modals/ModalAddProfileImage";
import { storage, auth, firestore } from "../../firebase/config";
import { getDownloadURL, ref } from "firebase/storage";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { TouchableOpacity } from "react-native-gesture-handler";
import ModalChangePassword from "../../components/common/modals/ModalChangePassword";
import { deleteUser, signOut } from "firebase/auth";
import { router } from "expo-router";

export default function Perfil() {
  const StyledPressable = styled(Pressable);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalChangePasswordVisible, setModalChangePasswordVisible] =
    useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const mail = auth.currentUser.email;

  //Función que obtiene los datos del usuario de la base de datos
  const handleGetUserDoc = async () => {
    try {
      const userRef = doc(firestore, "clientes", mail);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setName(userDoc.data().name);
        setLastName(userDoc.data().lastName);
        setPhone(userDoc.data().phone);
      } else {
        console.log("No se encuentra el documento");
      }
    } catch (error) {
      console.error("Error obteniendo los datos:", error.message);
    }
  };

  //Función que elimina la cuenta del usuario tanto de firestore como de auth
  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const email = user.email;
        const userRef = doc(firestore, "clientes", email);
        await signOut(auth);
        await deleteUser(user);
        await deleteDoc(userRef);
        router.navigate("/");
      } catch (error) {
        console.error("No ha podido eliminarse la cuenta:", error.message);
        Alert.alert("No se ha podido eliminar la cuenta");
      }
    } else {
      Alert.alert("No se ha podido eliminar la cuenta");
    }
  };

  const showDeleteConfirmation = () => {
    Alert.alert(
      "Eliminar producto",
      "¿Está seguro de que quieres eliminar tu cuenta?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Eliminación cancelada"),
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () => handleDeleteAccount(),
          style: "destructive",
        },
      ],
    );
  };

  useEffect(() => {
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
    handleGetUserDoc();
  });
  return (
    <View style={styles.container}>
      <StyledPressable
        style={{ width: "50%", height: "25%" }}
        onPress={() => setModalVisible(true)}
      >
        {!loading ? (
          <Image
            source={profileImage ? { uri: profileImage } : NoPhoto}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 75,
            }}
            resizeMode="cover"
          />
        ) : (
          <ActivityIndicator size="large" color="black" />
        )}
      </StyledPressable>
      <Text className="text-black font-bold text-xl p-1">
        {name} {lastName}
      </Text>
      <Text className="text-black font-bold text-xl p-1">Email: {mail}</Text>
      <Text className="text-black font-bold text-xl p-1">
        Teléfono: {phone}
      </Text>
      <ModalAddProfileImage
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
      <TouchableOpacity className="bg-white rounded-xl p-2 border-2 mt-2 mb-2">
        <Text className="text-black font-bold text-lg">Citas</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setModalChangePasswordVisible(true)}
        className="bg-white rounded-xl p-2 border-2 mt-2 mb-2"
      >
        <Text className="text-black font-bold text-lg">Cambiar Contraseña</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={showDeleteConfirmation}
        className="bg-white rounded-xl p-2 border-2 mt-2 mb-2"
      >
        <Text className="text-black font-bold text-lg">Eliminar Cuenta</Text>
      </TouchableOpacity>
      <ModalChangePassword
        modalVisible={modalChangePasswordVisible}
        setModalVisible={setModalChangePasswordVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
});
