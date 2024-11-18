import { FlatList, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AddProduct from "../../components/peluqueros/Modals/AddProduct";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase/config";
import BarberProduct from "../../components/peluqueros/BarberProduct";
import { ReloadIcon } from "../../components/common/Icons";

export default function Productos() {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [products, setProducts] = useState([]);

  //Función que obtiene los productos de firestore
  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "productos"));
      const productsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(), // Desestructurar los datos de cada documento
      }));
      setProducts(productsArray); // Guardar los productos en el estado
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  //Función que renderiza cada producto
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        paddingBottom: insets.bottom,
        paddingTop: 30,
        padding: 6,
        backgroundColor: "#white",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BarberProduct item={item} fetchProductos={fetchProducts} />
        )}
      />
      <View className="items-center justify-center mt-2 flex-row">
        <TouchableOpacity
          style={{
            backgroundColor: "black",
            padding: 12,
            borderRadius: 28,
            marginLeft: 2,
          }}
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-white font-bold">Crear Producto</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={fetchProducts}>
          <ReloadIcon size={40} />
        </TouchableOpacity>
      </View>

      {/** Modal para crear los productos */}
      <AddProduct
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        refreshProducts={fetchProducts}
      />
    </View>
  );
}
