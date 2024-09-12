import { View, Text } from "react-native";
import { useState, useEffect } from "react";
import { collection, getDocs, where, query } from "firebase/firestore";
import { firestore } from "../../firebase/config";
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
          return <ConfirmedReservation item={item} />;
        }}
      />
    </View>
  );
}
