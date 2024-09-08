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

export default function ClientHome() {
  const [searchText, setSearchText] = useState("");
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

  const phoneCall = () => {
    if (Platform.OS === "android") {
      Linking.openURL("tel:+34674977133");
    } else if (Platform.OS === "ios") {
      Linking.openURL("telprompt:+34674977133");
    } else {
      console.log("No se puede realizar la llamada");
    }
  };

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
            color: "white",
            backgroundColor: "black",
            borderRadius: 28,
            padding: 12,
            fontSize: 16,
            marginRight: 2,
          }}
          placeholder="Buscar producto..."
          placeholderTextColor={"white"}
          onChangeText={(text) => setSearchText(text)}
          value={searchText}
        />
        <TouchableOpacity
          onPress={phoneCall}
          style={{
            backgroundColor: "black",
            padding: 12,
            borderRadius: 28,
            marginLeft: 2,
          }}
        >
          <PhoneIcon size={28} color={"white"} />
        </TouchableOpacity>
      </View>
      <View className="p-3 flex-grow">
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ClientProduct item={item} />}
        />
      </View>
      <View className="items-center justify-center flex-1">
        <TouchableOpacity className="bg-black rounded-3xl p-3">
          <Text className="text-white font-bold text-2xl">Reservar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
