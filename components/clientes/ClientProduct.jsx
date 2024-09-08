import { Text, View, StyleSheet } from "react-native";
import { CheckBox } from "react-native-elements";
import { useState } from "react";

export default function ClientProduct({ item }) {
  const [checked, setChecked] = useState(false);

  const toggleCheckBox = () => {
    setChecked(!checked);
  };
  return (
    <View style={styles.productContainer}>
      <CheckBox
        checked={checked}
        onPress={toggleCheckBox}
        checkedColor="green"
        uncheckedColor="gray"
      />
      <View className="flex-shrink">
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productText}>Precio: {item.price}€</Text>
        <Text style={styles.productText}>{item.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  productContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    marginVertical: 8,
  },

  productName: {
    fontSize: 26,
    fontWeight: "bold",
  },

  productText: {
    fontSize: 16,
    marginTop: 4,
  },
});
