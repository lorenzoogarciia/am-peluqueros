import {
  Text,
  TextInput,
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useState } from "react";
import { firestore } from "../../../firebase/config";
import { doc, setDoc } from "firebase/firestore";

export default function AddProduct({
  modalVisible,
  setModalVisible,
  refreshProducts,
}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");

  //Función que reinicia los valores del modal al cerrarse
  const handleReloadModal = () => {
    setModalVisible(false);
    refreshProducts();
    setName("");
    setPrice(0);
    setDescription("");
    setModalVisible(false);
  };

  //Función que sirve para crear el producto en firestore
  const handleCreateProduct = () => {
    if (name && price && description) {
      try {
        const productRef = doc(firestore, "productos", name);
        setDoc(productRef, {
          name,
          price,
          description,
        });
        handleReloadModal();
        Alert.alert("Producto creado correctamente");
      } catch (error) {
        console.error("Error al crear producto: ", error);
        Alert.alert("Error al crear producto", error.message);
      }
    } else {
      Alert.alert("Por favor, rellene y revise todos los campos");
    }
  };
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={modalVisible}
      onRequestClose={handleReloadModal}
    >
      <View className="items-center justify-end flex-1">
        <View
          style={{
            backgroundColor: "white",
            height: "55%",
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
          <Text className="font-bold text-2xl">🛍️ Crear Producto</Text>
          <TextInput
            placeholder="Nombre..."
            style={styles.input}
            placeholderTextColor={"black"}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            placeholder="Precio..."
            style={styles.input}
            placeholderTextColor={"black"}
            keyboardType="numeric"
            value={price}
            onChangeText={(text) => setPrice(parseFloat(text) || 0)}
          />
          <TextInput
            placeholder="Descripción..."
            style={styles.input}
            placeholderTextColor={"black"}
            value={description}
            onChangeText={setDescription}
          />
          <TouchableOpacity
            className="bg-white rounded-xl p-2 border-2 mt-2 mb-2"
            onPress={handleCreateProduct}
          >
            <Text className="text-lg text-black font-bold">
              Crear Producto ✅
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleReloadModal}
            className="bg-white rounded-xl p-2 border-2"
          >
            <Text className="text-lg text-black font-bold">Cancelar ❎</Text>
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
