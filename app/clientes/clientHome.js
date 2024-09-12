import {
  View,
  Platform,
  Linking,
  TouchableOpacity,
  TextInput,
  FlatList,
  Text,
  Animated,
} from "react-native";
import { PhoneIcon } from "../../components/common/Icons";
import { useCallback, useRef, useState } from "react";
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
  const [showButton, setShowButton] = useState(false);
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

  //Función que maneja la selección de productos
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

  //Función que anima el botón de reservar
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  //Función de animación para cuando se hace visible el botón
  const animateIn = useCallback(() => {
    setShowButton(true);
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, opacityAnim]);

  //Función de animación para cuando se oculta el botón
  const animateOut = useCallback(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setShowButton(false));
  }, [scaleAnim, opacityAnim]);

  //Función que renderiza cada producto
  useEffect(() => {
    fetchProducts();
  }, []);

  //Animación del botón de reservar
  useEffect(() => {
    if (selectedProducts.length > 0) {
      animateIn();
    } else {
      animateOut();
    }
  }, [selectedProducts, animateIn, animateOut]);

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
      {/* Lista de productos */}
      <View className="p-3 flex-grow">
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ClientProduct item={item} onProductSelect={handleProductSelect} />
          )}
        />
      </View>
      {/* Botón de Reservar */}
      {showButton && (
        <Animated.View
          style={{
            paddingBottom: insets.bottom,
            position: "absolute",
            left: 0,
            right: 0,
            alignItems: "center",
            justifyContent: "center",
            bottom: 0,
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          }}
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
        </Animated.View>
      )}
      <ModalReserva
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        selectedProducts={selectedProducts}
      />
    </View>
  );
}
