import "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function ClientLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer></Drawer>
    </GestureHandlerRootView>
  );
}
