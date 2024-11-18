import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { firestore } from "../../app/firebase/config";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import sendEmail from "../../app/services/mailjet";
import { CancelIcon, CheckIcon } from "../common/Icons";
import ReservationProducts from "./Modals/ReservationProducts";

export default function Reservation({ item, fetchReservations }) {
  const [userName, setUserName] = useState("");
  const [userLastname, setUserLastname] = useState("");
  const [reservationDate, setDate] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  //Función que confirma la reserva
  const confirmReservation = async () => {
    try {
      const reservationRef = doc(firestore, "reservations", item.id);
      await updateDoc(reservationRef, {
        status: "Confirmada",
      });
      sendEmail(
        item.user,
        "Reserva confirmada",
        `Su reserva para el día ${reservationDate} a las ${item.time} ha sido confirmada. Muchas gracias por confiar en nosotros.`,
      );
      Alert.alert("Reserva confirmada con éxito");
      fetchReservations();
    } catch (error) {
      console.error("Error al confirmar la reserva:", error);
    }
  };

  //Función que cancela la reserva
  const cancelReservation = async () => {
    try {
      const reservatioinRef = doc(firestore, "reservations", item.id);
      await deleteDoc(reservatioinRef);
      sendEmail(
        item.user,
        "Reserva confirmada",
        `Su reserva para el día ${reservationDate} a las ${item.time} ha sido cancelada, lo sentimos mucho, muchas gracias por confiar en nosotros.`,
      );
      Alert.alert("Reserva cancelada con éxito");
      fetchReservations();
    } catch (error) {
      console.error("Error al cancelar la reserva:", error);
    }
  };

  useEffect(() => {
    //Función que obtiene el nombre del usuario
    const fetchUserName = async () => {
      try {
        const q = query(
          collection(firestore, "clientes"),
          where("email", "==", item.user),
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const clientData = querySnapshot.docs[0].data();
          setUserName(clientData.name);
          setUserLastname(clientData.lastName);

          const timestamp = item.date;
          const date = timestamp.toDate();
          setDate(date.toLocaleDateString());
        }
      } catch (error) {
        console.error("Error al obtener el nombre del usuario:", error);
      }
    };
    fetchUserName();
  }, [item.user, item.date]);

  return (
    <View style={styles.container}>
      <View className="flex-row">
        <Text style={styles.text}>{userName ? userName : item.user}</Text>
        <Text style={styles.text}>{userLastname ? userLastname : ""}</Text>
      </View>
      <View>
        <Text style={styles.details}>Fecha: {reservationDate}</Text>
        <Text style={styles.details}>Hora: {item.time}</Text>
        <Text style={styles.details}>Estado: {item.status}</Text>
        <Text style={styles.details}>Precio: {item.totalPrice}€</Text>
        <TouchableOpacity
          style={styles.productos}
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-base font-bold p-2">Productos</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonView}>
        <TouchableOpacity
          style={styles.checkButton}
          onPress={confirmReservation}
        >
          <CheckIcon color={"white"} size={30} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={cancelReservation}
        >
          <CancelIcon color={"white"} size={30} />
        </TouchableOpacity>
      </View>
      <ReservationProducts
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        products={item.products}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    borderRadius: 15,
    borderWidth: 1,
    marginTop: 15,
    margin: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 5,
  },
  details: {
    fontSize: 16,
    paddingTop: 4,
  },
  productos: {
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  buttonView: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  checkButton: {
    backgroundColor: "green",
    padding: 5,
    borderRadius: 10,
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 10,
    marginLeft: 10,
  },
});
