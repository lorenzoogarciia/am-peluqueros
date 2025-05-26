import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";

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

export const CalendarIcon = (props) => (
  <Ionicons name="calendar" size={24} color="black" {...props} />
);

export const ClientsIcon = (props) => (
  <Ionicons name="people-sharp" size={24} color="black" {...props} />
);

export const SignOutIcon = (props) => (
  <FontAwesome name="sign-out" size={24} color="black" {...props} />
);

export const DetailsIcon = (props) => (
  <Ionicons name="newspaper-outline" size={24} color="black" {...props} />
);

export const PhoneIcon = (props) => (
  <Feather name="phone-call" size={24} color="black" {...props} />
);

export const ProductsIcon = (props) => (
  <Feather name="shopping-bag" size={24} color="black" {...props} />
);

export const TrashIcon = (props) => (
  <Feather name="trash-2" size={24} color="black" {...props} />
);

export const ReloadIcon = (props) => (
  <Ionicons name="reload-circle-sharp" size={24} color="black" {...props} />
);

export const CheckIcon = (props) => (
  <Entypo name="check" size={24} color="black" {...props} />
);

export const CancelIcon = (props) => (
  <Entypo name="cross" size={24} color="black" {...props} />
);

export const DrawerIcon = (props) => (
  <Entypo name="menu" size={24} color="black" {...props} />
);

export const FilterIcon = (props) => (
  <Ionicons name="filter-sharp" size={24} color="black" {...props} />
);
