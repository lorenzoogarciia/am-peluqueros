import { Modal, View, Text, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { storage, auth } from "../../../firebase/config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export default function ModalAddProfileImage({
  modalVisible,
  setModalVisible,
}) {
  //Función que abre la galería
  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Se necesita permiso para acceder a la galería",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.cancelled) {
      const { uri } = result.assets[0];
      console.log("Imagen seleccionada: " + uri);
      await uploadImageToFirebase(uri);
    } else {
      console.log("No se ha seleccionado ninguna imagen");
      Alert.alert("Error", "No se ha seleccionado ninguna imagen");
    }
  };

  //Función que sube la imagen a Firebase
  const uploadImageToFirebase = async (uri) => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "No se ha podido subir la imagen");
    }
    try {
      const filename = `${user.uid}_profile.jpg`;
      const storageRef = ref(storage, `/profileImages/${filename}`);

      const response = await fetch(uri);
      const blob = await response.blob();

      const task = uploadBytesResumable(storageRef, blob);

      task.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Subida: ${progress}% completada`);
        },
        (error) => {
          console.log("Error al subir la imagen: " + error.message);
        },
        async () => {
          const downloadURL = await getDownloadURL(task.snapshot.ref);
          console.log("Imagen subida correctamente: " + downloadURL);
          Alert.alert("Imagen subida correctamente");
        },
      );
    } catch (e) {
      console.log("Error al subir la imagen: " + e.message);
      Alert.alert("Error", "No se ha podido subir la imagen");
    }
  };
  return (
    <Modal transparent={true} animationType="slide" visible={modalVisible}>
      <View className="items-center justify-end flex-1">
        <View
          style={{
            backgroundColor: "white",
            height: "16%",
            width: "80%",
            margin: 30,
            borderRadius: 20,
            paddingHorizontal: 30,
            paddingVertical: 20,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
          }}
        >
          <TouchableOpacity
            onPress={selectImage}
            className="bg-white rounded-xl p-2 border-2 mb-2"
          >
            <Text className="font-bold text-lg text-black">
              📸 Cambiar Foto de Perfil
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            className="bg-white rounded-xl p-2 border-2 mt-2"
          >
            <Text className="text-lg text-black font-bold">❎ Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
