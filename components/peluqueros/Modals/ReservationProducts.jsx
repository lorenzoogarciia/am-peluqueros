import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
export default function ReservationProducts({
  modalVisible,
  setModalVisible,
  products,
}) {
  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      animationType="slide"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <View className="flex-1 items-center justify-end">
        <View
          style={{
            backgroundColor: "white",
            height: "50%",
            width: "90%",
            margin: 30,
            borderRadius: 20,
            paddingHorizontal: 30,
            paddingVertical: 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
          }}
        >
          <View style={styles.productsColumn}>
            <Text style={styles.productsColumnText}>Productos</Text>
            <Text style={styles.productsColumnText}>Precio</Text>
          </View>
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <View style={styles.productsContainer}>
                  <View style={styles.productsView}>
                    <Text style={styles.productsText}>{item.name}</Text>
                    <Text style={styles.productsText}>{item.price}€</Text>
                  </View>
                </View>
              );
            }}
          />
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.button}
          >
            <Text className="font-bold text-2xl">Salir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 20,
    marginLeft: 2,
    borderWidth: 1,
    alignSelf: "center",
  },
  productsColumn: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productsColumnText: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 5,
    flexShrink: 1,
  },
  productsContainer: {
    flex: 1,
  },
  productsView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productsText: {
    fontWeight: "bold",
    fontSize: 20,
    padding: 5,
    flexShrink: 1,
  },
});
