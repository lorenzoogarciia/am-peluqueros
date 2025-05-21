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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 3,
          width: "100%",
        }}
      >
        <Text style={styles.clientName} numberOfLines={1} ellipsizeMode="tail">
          {item.name}
        </Text>
        <Text style={styles.clientName} numberOfLines={1} ellipsizeMode="tail">
          {item.lastName}
        </Text>
      </View>
      <TouchableOpacity onPress={sendEmail}>
        <Text style={styles.clientText} numberOfLines={1} ellipsizeMode="tail">
          {item.email}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={phoneCall}>
        <Text style={styles.clientText}>{item.phone}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  productContainer: {
    alignItems: "start",
    justifyContent: "start",
    backgroundColor: "white",
    width: "95%",
    alignSelf: "center",
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
    marginVertical: 5,
  },

  clientName: {
    fontSize: 20,
    fontWeight: "bold",
    flexShrink: 1,
  },

  clientText: {
    fontSize: 16,
    marginTop: 10,
  },
});
