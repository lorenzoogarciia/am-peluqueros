import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../app/firebase/config";
import ReservationProducts from "./Modals/ReservationProducts";
import { TrashIcon } from "../common/Icons";
export default function ConfirmedReservation({ item, onDelete }) {
  const [userName, setUserName] = useState("");
  const [userLastname, setUserLastname] = useState("");
  const [reservationDate, setDate] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isPast, setIsPast] = useState(false);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(item.id);
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
    const checkIfPast = () => {
      const now = new Date();
      const reservationDate = item.date.toDate();
      const [hours, minutes] = item.time.split(":").map(Number);
      reservationDate.setHours(hours, minutes, 0, 0);
      setIsPast(reservationDate < now);
      setDate(reservationDate.toLocaleDateString());
    };
    fetchUserName();
    checkIfPast();
  }, [item]);
  return (
    <View style={styles.container}>
      <View className="flex-row">
        <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
          {userName ? userName : item.user}
        </Text>
        <Text style={styles.text}>{userLastname ? userLastname : ""}</Text>
        {isPast && (
          <TouchableOpacity
            onPress={handleDelete}
            style={{ position: "absolute", right: 0, top: 0 }}
          >
            <TrashIcon size={24} color="red" />
          </TouchableOpacity>
        )}
      </View>
      <View>
        <Text style={styles.details}>Fecha: {reservationDate}</Text>
        <Text style={styles.details}>Hora: {item.time}</Text>
        <Text style={styles.details}>Estado: {item.status}</Text>
        <Text style={styles.details}>Importe: {item.totalPrice}€</Text>
        <TouchableOpacity
          style={styles.productos}
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-base font-bold p-2">Productos</Text>
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
    position: "relative",
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
