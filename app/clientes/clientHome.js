import {
  View,
  Platform,
  Linking,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { PhoneIcon } from "../../components/common/Icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
export default function ClientHome() {
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState("");

  const phoneCall = () => {
    if (Platform.OS === "android") {
      Linking.openURL("tel:+34674977133");
    } else if (Platform.OS === "ios") {
      Linking.openURL("telprompt:+34674977133");
    } else {
      console.log("No se puede realizar la llamada");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "start",
        paddingBottom: insets.bottom,
        paddingTop: 30,
        padding: 6,
        backgroundColor: "#white",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <TextInput
        style={{
          height: 50,
          borderColor: "black",
          width: "70%",
          color: "white",
          backgroundColor: "black",
          borderRadius: 28,
          padding: 12,
          fontSize: 16,
          marginRight: 2,
        }}
        placeholder="Buscar producto..."
        placeholderTextColor={"white"}
        onChangeText={(text) => setSearchText(text)}
        value={searchText}
      />
      <TouchableOpacity
        onPress={phoneCall}
        style={{
          backgroundColor: "black",
          padding: 12,
          borderRadius: 28,
          marginLeft: 2,
        }}
      >
        <PhoneIcon size={28} color={"white"} />
      </TouchableOpacity>
    </View>
  );
}
