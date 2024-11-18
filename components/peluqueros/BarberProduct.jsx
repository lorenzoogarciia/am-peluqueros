import { StyleSheet, Text, View, Alert } from "react-native";
import { TrashIcon } from "../common/Icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { firestore } from "../../app/firebase/config";
import { doc, deleteDoc } from "firebase/firestore";

export default function BarberProduct({ item, fetchProductos }) {
  const handleDeleteProduct = async (id) => {
    try {
      const productRef = doc(firestore, "productos", id);
      await deleteDoc(productRef);
      fetchProductos();
      Alert.alert("Producto eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar producto: ", error);
      Alert.alert("Error al eliminar producto", error.message);
    }
  };
  const showDeleteConfirmation = () => {
    Alert.alert(
      "Eliminar producto",
      "¿Está seguro de que quieres eliminar este producto?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Eliminación cancelada"),
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () => handleDeleteProduct(item.id),
          style: "destructive",
        },
      ],
    );
  };
  return (
    <View style={styles.productContainer}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.productName}>{item.name}</Text>
        <TouchableOpacity onPress={showDeleteConfirmation}>
          <TrashIcon color="red" />
        </TouchableOpacity>
      </View>
      <Text style={styles.productText}>Precio: {item.price}€</Text>
      <Text style={styles.productText}>{item.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  productContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    margin: 5,
  },

  productName: {
    fontSize: 26,
    fontWeight: "bold",
    marginRight: 10,
  },

  productText: {
    fontSize: 16,
    marginTop: 10,
  },
});
