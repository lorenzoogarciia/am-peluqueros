import { View, Text, Alert } from "react-native";
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  where,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { firestore } from "../firebase/config";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlatList } from "react-native-gesture-handler";
import ConfirmedReservation from "../../components/peluqueros/ConfirmedReservation";
export default function Citas() {
  const insets = useSafeAreaInsets();
  const [reservations, setReservations] = useState([]);

  const fetchReservations = async () => {
    try {
      const reservationsQuery = query(
        collection(firestore, "reservations"),
        where("status", "==", "Confirmada"),
      );
      const querySnapshot = await getDocs(reservationsQuery);
      const now = new Date(); // Fecha y hora actuales
      const reservationsArray = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const reservationDate = data.date.toDate(); // Convertimos el timestamp a Date
        const isPast = reservationDate < now; // Comparamos si es anterior a la fecha y hora actual
        return {
          id: doc.id,
          ...data,
          isPast, // Marcamos si es una cita pasada
        };
      });
      setReservations(reservationsArray);
    } catch (error) {
      console.error("Error al obtener las reservas:", error);
    }
  };

  const handleDeleteReservation = async (id) => {
    try {
      await deleteDoc(doc(firestore, "reservations", id));
      Alert.alert("Cita Eliminada", "La cita ha sido eliminada con éxito");
      fetchReservations();
    } catch (error) {
      console.error("Error al eliminar la reserva:", error);
      Alert.alert("Error", "No se ha podido eliminar la cita", error.message);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);
  return (
    <View
      style={{
        flex: 1,
        margin: 5,
        paddingTop: insets.top - 40,
        paddingBottom: insets.bottom,
      }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          borderBottomWidth: 2,
        }}
      >
        <Text className="font-bold text-2xl">Citas Agendadas</Text>
      </View>
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <ConfirmedReservation
              item={item}
              onDelete={handleDeleteReservation}
            />
          );
        }}
      />
    </View>
  );
}
