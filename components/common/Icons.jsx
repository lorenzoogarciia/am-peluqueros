import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export const BackIcon = (props) => (
  <Ionicons
    name="chevron-back-circle-outline"
    size={24}
    color="black"
    {...props}
  />
);

export const HomeIcon = (props) => (
  <Ionicons name="home-outline" size={24} color="black" {...props} />
);

export const ProfileIcon = (props) => (
  <Ionicons name="person-circle-outline" size={24} color="black" {...props} />
);

export const ClientsIcon = (props) => (
  <Ionicons name="people-sharp" size={24} color="black" {...props} />
);

export const SignOutIcon = (props) => (
  <FontAwesome name="sign-out" size={24} color="black" {...props} />
);
