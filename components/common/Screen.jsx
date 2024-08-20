import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";

export function Screen({ children }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: "#white",
      }}
    >
      {children}
    </View>
  );
}
