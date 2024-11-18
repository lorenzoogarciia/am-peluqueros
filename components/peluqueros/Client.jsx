import { StyleSheet, Text, View, Linking, Platform } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Client({ item }) {
  const phoneCall = () => {
    if (Platform.OS === "android") {
      Linking.openURL(`tel:${item.phone}`);
    } else if (Platform.OS === "ios") {
      Linking.openURL(`telprompt:${item.phone}`);
    } else {
      console.log("No se puede realizar la llamada");
    }
  };
  const sendEmail = () => {
    const emailUrl = `mailto:${item.email}`;
    Linking.openURL(emailUrl).catch((error) =>
      console.log("Error al intentar enviar el email:", error.message),
    );
  };
  return (
    <View style={styles.productContainer}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.clientName}>{item.name}</Text>
        <Text style={styles.clientName}>{item.lastName}</Text>
      </View>
      <TouchableOpacity onPress={sendEmail}>
        <Text style={styles.clientText}>Email: {item.email}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={phoneCall}>
        <Text style={styles.clientText}>Teléfono: {item.phone}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  productContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    marginVertical: 5,
  },

  clientName: {
    fontSize: 26,
    fontWeight: "bold",
    marginRight: 10,
  },

  clientText: {
    fontSize: 16,
    marginTop: 10,
  },
});
