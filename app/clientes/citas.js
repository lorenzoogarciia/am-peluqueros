import React from "react";
import { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { auth, firestore } from "../firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { FlatList } from "react-native-gesture-handler";
import ConfirmedReservationClient from "../../components/clientes/ConfirmedReservationClient";
import { ReloadIcon } from "../../components/common/Icons";

export default function Citas() {
  const insets = useSafeAreaInsets();
  const [reservations, setReservations] = useState([]);

  const fetchReservations = async () => {
    try {
      const user = auth.currentUser.email;
      const reservationsQuery = query(
        collection(firestore, "reservations"),
        where("user", "==", user),
      );
      const querySnapshot = await getDocs(reservationsQuery);
      const reservationsArray = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        };
      });
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
      style={[
        styles.mainContainer,
        { paddingBottom: insets.bottom, paddingTop: insets.top - 40 },
      ]}
    >
      <View style={styles.listContainer}>
        <Text className="text-xl font-bold">Citas Agendadas</Text>
      </View>
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return <ConfirmedReservationClient item={item} />;
        }}
      />
      <View
        style={{
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={fetchReservations}>
          <ReloadIcon size={40} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    margin: 5,
  },
  listContainer: {
    alignItems: "center",
    alignContent: "center",
    borderBottomWidth: 2,
    padding: 5,
  },
});
