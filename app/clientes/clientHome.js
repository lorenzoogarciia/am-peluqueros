import {
  View,
  Platform,
  Linking,
  TouchableOpacity,
  TextInput,
  FlatList,
  Text,
} from "react-native";
import { PhoneIcon } from "../../components/common/Icons";
import { useState } from "react";
import { useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase/config";
import ClientProduct from "../../components/clientes/ClientProduct";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ModalReserva from "../../components/clientes/ModalReserva";

export default function ClientHome() {
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

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

  const handleProductSelect = (product, isSelected) => {
    if (isSelected) {
      setSelectedProducts((prevSelectedProducts) => [
        ...prevSelectedProducts,
        product,
      ]);
    } else {
      setSelectedProducts((prevSelectedProducts) =>
        prevSelectedProducts.filter((p) => p.id !== product.id),
      );
    }
  };

  //Función que realiza una llamada telefónica
  const phoneCall = () => {
    if (Platform.OS === "android") {
      Linking.openURL("tel:+34674977133");
    } else if (Platform.OS === "ios") {
      Linking.openURL("telprompt:+34674977133");
    } else {
      console.log("No se puede realizar la llamada");
    }
  };

  //Función que filtra los productos por nombre
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  //Función que renderiza cada producto
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View className="flex-row p-4 items-center justify-center">
        <TextInput
          style={{
            height: 50,
            borderColor: "black",
            width: "70%",
            color: "black",
            backgroundColor: "white",
            borderRadius: 28,
            borderWidth: 2,
            padding: 12,
            fontSize: 16,
            marginRight: 2,
          }}
          placeholder="Buscar producto..."
          placeholderTextColor={"black"}
          onChangeText={(text) => setSearchText(text)}
          value={searchText}
        />
        <TouchableOpacity
          onPress={phoneCall}
          style={{
            backgroundColor: "white",
            padding: 12,
            borderRadius: 28,
            marginLeft: 2,
            borderWidth: 2,
          }}
        >
          <PhoneIcon size={28} color={"black"} />
        </TouchableOpacity>
      </View>
      <View className="p-3 flex-grow">
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ClientProduct item={item} onProductSelect={handleProductSelect} />
          )}
        />
      </View>
      <View
        className="items-center justify-center"
        style={{ paddingBottom: insets.bottom }}
      >
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
            console.log(selectedProducts);
          }}
          className="bg-black rounded-3xl p-3"
        >
          <Text className="text-white font-bold text-2xl">Reservar</Text>
        </TouchableOpacity>
        <ModalReserva
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          selectedProducts={selectedProducts}
        />
      </View>
    </View>
  );
}
