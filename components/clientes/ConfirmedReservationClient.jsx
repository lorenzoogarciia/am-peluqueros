import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../app/firebase/config";
import ReservationProducts from "../peluqueros/Modals/ReservationProducts";
export default function ConfirmedReservationClient({ item }) {
  const [userName, setUserName] = useState("");
  const [userLastname, setUserLastname] = useState("");
  const [reservationDate, setDate] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

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
  }, [item]);
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
