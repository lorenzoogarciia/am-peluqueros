import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { collection, getDocs, where, query } from "firebase/firestore";
import { firestore } from "../firebase/config";
import Reservation from "../../components/peluqueros/Reservation";
import { ReloadIcon } from "../../components/common/Icons";
export default function BarberHome() {
  const insets = useSafeAreaInsets();
  const [reservations, setReservations] = useState([]);

  const fetchReservations = async () => {
    try {
      const reservationsQuery = query(
        collection(firestore, "reservations"),
        where("status", "==", "Pendiente de confirmación"),
      );
      const querySnapshot = await getDocs(reservationsQuery);
      const reservationsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReservations(reservationsArray);
    } catch (error) {
      console.error("Error al obtener las reservas:", error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);
  return (
    <View
      className="flex-1"
      style={{
        margin: 5,
        paddingTop: insets.top - 40,
        paddingBottom: insets.bottom,
      }}
    >
      <View
        className="items-center justify-center"
        style={{ borderBottomWidth: 1 }}
      >
        <Text className="font-bold text-2xl">
          Citas Pendientes de confirmación
        </Text>
      </View>
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Reservation item={item} fetchReservations={fetchReservations} />
        )}
      />
      <TouchableOpacity
        className="items-center justify-center"
        onPress={fetchReservations}
      >
        <ReloadIcon size={40} />
      </TouchableOpacity>
    </View>
  );
}
