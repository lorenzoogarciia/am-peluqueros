import {
  Image,
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Text,
} from "react-native";
import { useState, useEffect } from "react";
import NoPhoto from "../../assets/usuario-nophoto.png";
import { styled } from "nativewind";
import ModalAddProfileImage from "../../components/common/modals/ModalAddProfileImage";
import { storage, auth, firestore } from "../firebase/config";
import { getDownloadURL, ref } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";
import { TouchableOpacity } from "react-native-gesture-handler";
import ModalChangePassword from "../../components/common/modals/ModalChangePassword";

export default function Perfil() {
  const StyledPressable = styled(Pressable);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalChangePasswordVisible, setModalChangePasswordVisible] =
    useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const mail = auth.currentUser.email;

  const handleGetUserDoc = async () => {
    try {
      const userRef = doc(firestore, "peluqueros", mail);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setName(userDoc.data().name);
      } else {
        console.log("No se encuentra el documento");
      }
    } catch (error) {
      console.error("Error obteniendo los datos:", error.message);
    }
  };

  useEffect(() => {
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
              borderRadius: 40,
            }}
            resizeMode="cover"
          />
        ) : (
          <ActivityIndicator size="large" color="black" />
        )}
      </StyledPressable>
      <Text className="text-black font-bold text-xl p-1">{name}</Text>
      <Text className="text-black font-bold text-xl p-1">{mail}</Text>
      <ModalAddProfileImage
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
      <TouchableOpacity
        onPress={() => setModalChangePasswordVisible(true)}
        className="bg-white rounded-xl p-2 border-2 mt-2 mb-2"
      >
        <Text className="text-black font-bold text-lg text-center">
          Cambiar Contraseña
        </Text>
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
    justifyContent: "top",
    alignItems: "start",
    padding: 32,
  },
});
