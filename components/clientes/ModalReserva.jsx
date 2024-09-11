import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { firestore, auth } from "../../firebase/config";
import { doc, setDoc } from "firebase/firestore";
import sendMail from "../../config/mailjet";
import sendEmail from "../../config/mailjet";
export default function ModalReserva({
  modalVisible,
  setModalVisible,
  selectedProducts,
}) {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [showTimePicker, setShowTimePicker] = useState(false);
  //Función que calcula el precio total de los productos
  const totalPrice = selectedProducts.reduce(
    (acc, product) => acc + product.price,
    0,
  );

  //Función que resetea el modal al cerrarlo
  const resetModal = () => {
    setDate(new Date());
    setSelectedTime("09:00");
    setShowDatePicker(false);
    setShowTimePicker(false);
    setModalVisible(false);
  };
  //Función que muestra el datePicker
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  //Función que muestra el datePicker en Android
  const showDatePickerAndroid = () => {
    setShowDatePicker(true);
  };

  //Función que genera las horas
  const generateTimeSlots = () => {
    const timeSlots = [];
    let startTime = 9 * 60;
    const endTime = 21 * 60;

    while (startTime <= endTime) {
      const hours = Math.floor(startTime / 60);
      const minutes = startTime % 60;
      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
      timeSlots.push(formattedTime);
      startTime += 30;
    }
    return timeSlots;
  };

  const selectTime = (time) => {
    setSelectedTime(time);
    setShowTimePicker(false);
  };

  const timeSlots = generateTimeSlots();

  const createReservation = async () => {
    const email = auth.currentUser.email;
    const reservationId = `${email}-${date.toISOString().split("T")[0]}-${selectedTime}`;
    const reservation = {
      date: date,
      time: selectedTime,
      status: "Pendiente de confirmación",
      products: selectedProducts,
      totalPrice: totalPrice,
      user: email,
    };
    try {
      const docRef = await setDoc(
        doc(firestore, "reservations", reservationId),
        reservation,
      );
      sendEmail(
        email,
        "Su solicitud de reserva ha sido recibida",
        `Su reserva para el día ${date.toLocaleDateString()} a las ${selectedTime}  ha sido solicitada correctamente. Deberá pagar un total de ${totalPrice.toString()}€.`,
      );
      console.log("Cita reservada con éxito ", docRef);
      setModalVisible(false);
      Alert.alert("Reserva solicitada con éxito");
    } catch (e) {
      console.error("Error reservando cita: " + e);
    }
  };

  //Vista del modal
  return (
    <Modal transparent={true} visible={modalVisible} animationType="slide">
      <View className="items-center justify-end flex-1">
        <View
          style={{
            backgroundColor: "white",
            height: "80%",
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
          {showDatePicker && (
            <View>
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "calendar"}
                onChange={onChange}
              />
            </View>
          )}
          {/* TimePicker */}
          {/* Modal para seleccionar hora */}
          <Modal
            visible={showTimePicker}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <FlatList
                  data={timeSlots}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.timeSlot}
                      onPress={() => selectTime(item)}
                    >
                      <Text style={styles.timeSlotText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                  numColumns={4}
                />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowTimePicker(false)} // Cerrar el modal sin seleccionar
                >
                  <Text>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
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
              onPress={() =>
                Platform.OS === "android"
                  ? showDatePickerAndroid()
                  : setShowDatePicker(!showDatePicker)
              }
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
          </View>
          {/* Hora */}
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
              onPress={() => setShowTimePicker(true)}
              style={styles.totalPriceContainer}
            >
              <Text className="font-bold text-lg">Seleccionar hora</Text>
            </TouchableOpacity>
            <Text
              style={styles.totalPriceContainer}
              className="font-bold text-lg"
            >
              {selectedTime}
            </Text>
          </View>
          {/* Precio Total */}
          <View style={styles.totalPriceContainer}>
            <Text style={styles.totalPrice}>
              Total: {totalPrice.toFixed(2)}€
            </Text>
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={createReservation} style={styles.button}>
              <Text className="text-lg font-bold">✅ Reservar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={resetModal} style={styles.button}>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "95%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  timeSlot: {
    aspectRatio: 1,
    margin: 5,
    padding: 5,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 70,
    maxWidth: 70,
  },
  timeSlotText: {
    fontSize: 15,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 15,
    borderWidth: 2,
  },
});
