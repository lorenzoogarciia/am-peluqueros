import {
  Modal,
  TouchableOpacity,
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import { useState } from "react";
import { auth } from "../../../firebase/config";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

export default function ModalChangePassword({ setModalVisible, modalVisible }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");

  const handleChangePassword = async () => {
    const user = auth.currentUser;

    if (!user) {
      console.log("No hay usuario logueado");
      Alert.alert("Error", "No hay usuario logueado");
    }

    if (newPassword !== repeatNewPassword) {
      console.log("Las contraseñas no coinciden");
      Alert.alert("Error", "Las contraseñas no coinciden");
    }

    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword,
    );

    try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      Alert.alert("Contraseña cambiada correctamente");
      setModalVisible(false);
    } catch (error) {
      console.error("Error al cambiar la contraseña: ", error);
      if (error.code === "auth/wrong-password") {
        Alert.alert("Error", "La contraseña actual es incorrecta");
      } else {
        Alert.alert("Error", "No se ha podido cambiar la contraseña");
      }
    }
  };
  return (
    <Modal transparent={true} animationType="slide" visible={modalVisible}>
      <View className="items-center justify-center flex-1">
        <View
          style={{
            backgroundColor: "white",
            height: "40%",
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
          <TextInput
            style={styles.input}
            placeholder="Contraseña actual"
            placeholderTextColor={"black"}
            secureTextEntry={true}
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Nueva contraseña"
            placeholderTextColor={"black"}
            secureTextEntry={true}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Repetir nueva contraseña"
            placeholderTextColor={"black"}
            secureTextEntry={true}
            value={repeatNewPassword}
            onChangeText={setRepeatNewPassword}
          />
          <TouchableOpacity
            onPress={handleChangePassword}
            className="bg-white rounded-xl p-2 border-2 mt-2 mb-2"
          >
            <Text className="text-lg text-black font-bold">
              💾 Guardar cambios
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            className="bg-white rounded-xl p-2 border-2 mt-2 mb-2"
          >
            <Text className="text-lg text-black font-bold">❎ Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  input: {
    marginTop: 10,
    marginBottom: 5,
    padding: 10,
    borderWidth: 2,
    borderRadius: 10,
    width: "100%",
    backgroundColor: "white",
    color: "black",
    textAlign: "start",
    fontSize: 16,
    fontWeight: "bold",
  },
});
