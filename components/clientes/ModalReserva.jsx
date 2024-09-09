import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
} from "react-native";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
export default function ModalReserva({
  modalVisible,
  setModalVisible,
  selectedProducts,
}) {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  //Función que calcula el precio total de los productos
  const totalPrice = selectedProducts.reduce(
    (acc, product) => acc + product.price,
    0,
  );

  //Función que muestra el datePicker
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };
  return (
    <Modal transparent={true} visible={modalVisible} animationType="slide">
      <View className="items-center justify-end flex-1">
        <View
          style={{
            backgroundColor: "white",
            height: "60%",
            width: "90%",
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
          <Text className="font-bold text-2xl">Reserve su cita</Text>
          {/* Lista de productos seleccionados */}
          <FlatList
            data={selectedProducts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.productList}>
                <Text style={styles.productText}>{item.name}</Text>
                <Text style={styles.productText}>{item.price}€</Text>
              </View>
            )}
          />
          {/* DatePicker */}
          <View
            style={{
              width: "100%",
              margin: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginHorizontal: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => setShowDatePicker(!showDatePicker)}
              style={styles.totalPriceContainer}
            >
              <Text className="font-bold text-lg">Seleccionar fecha</Text>
            </TouchableOpacity>
            <Text
              style={styles.totalPriceContainer}
              className="font-bold text-lg"
            >
              {date.toLocaleDateString()}
            </Text>
            {/** Mostramos el datePicker cuando sea verdadero */}
            {showDatePicker && (
              <View>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={onChange}
                />
              </View>
            )}
          </View>
          {/* Precio Total */}
          <View style={styles.totalPriceContainer}>
            <Text style={styles.totalPrice}>
              Total: {totalPrice.toFixed(2)}€
            </Text>
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.button}
            >
              <Text className="text-lg font-bold">✅ Reservar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.button}
            >
              <Text className="text-lg font-bold">❎ Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  productList: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 6,
    marginVertical: 6,
  },
  productText: {
    fontSize: 16,
    marginTop: 4,
    fontWeight: "bold",
  },
  totalPriceContainer: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: "bold",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    borderRadius: 20,
    padding: 12,
    marginHorizontal: 10,
    backgroundColor: "white",
    borderWidth: 2,
    marginTop: 20,
  },
});
