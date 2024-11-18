import { FlatList, View, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { firestore } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import Client from "../../components/peluqueros/Client";
import { ReloadIcon } from "../../components/common/Icons";

export default function Clientes() {
  const insets = useSafeAreaInsets();
  const [client, setClient] = useState([]);

  const fetchClient = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "clientes"));
      const clientArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClient(clientArray);
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
    }
  };

  useEffect(() => {
    fetchClient();
  }, []);
  return (
    <View
      style={{
        flex: 1,
        paddingBottom: insets.bottom,
        paddingTop: 30,
        padding: 5,
        backgroundColor: "#white",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <FlatList
        data={client}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Client item={item} fetchClients={fetchClient} />
        )}
      />
      <TouchableOpacity onPress={fetchClient}>
        <ReloadIcon size={50} />
      </TouchableOpacity>
    </View>
  );
}
