import { Modal, TouchableOpacity, View, Text } from "react-native";
import { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Switch } from "react-native-elements";

export default function ScheduleModal({
  scheduleModalVisible,
  setScheduleModalVisible,
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Lunes", value: "Lunes" },
    { label: "Martes", value: "Martes" },
    { label: "Miércoles", value: "Miércoles" },
    { label: "Jueves", value: "Jueves" },
    { label: "Viernes", value: "Viernes" },
    { label: "Sábado", value: "Sábado" },
    { label: "Domingo", value: "Domingo" },
  ]);
  const [selectedDay, setSelectedDay] = useState(items[0].value);
  const [openTime, setOpenTime] = useState(new Date());
  const [closeMorning, setCloseMorning] = useState(new Date());
  const [openAfternoon, setOpenAfternoon] = useState(new Date());
  const [closeAfternoon, setCloseAfternoon] = useState(new Date());
  const [isClosed, setIsClosed] = useState(false);
  return (
    <Modal
      visible={scheduleModalVisible}
      animationType="slide"
      transparent={true}
    >
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="bg-white rounded-xl p-4 w-11/12">
          <Text className="text-center font-bold text-xl">Horario</Text>
          <DropDownPicker
            open={open}
            value={selectedDay}
            items={items}
            setOpen={setOpen}
            setValue={setSelectedDay}
            setItems={setItems}
            className="mt-4"
            labelStyle={{
              fontWeight: "bold",
              textAlign: "center",
              fontSize: 16,
            }}
          />
          <Text className="text-xl font-bold text-center mt-4 border-b-2">
            Turno de Mañana
          </Text>
          <View className="flex-row">
            <View className="flex-row p-2 m-2">
              <Text className="font-bold text-lg">De:</Text>
              <DateTimePicker
                value={openTime}
                mode="time"
                locale="es-ES"
                is24Hour={true}
                display="default"
                onChange={(event, selectedDate) => {
                  const currentTime = selectedDate || openTime;
                  setOpenTime(currentTime);
                }}
              />
            </View>
            <View className="flex-row p-2 m-2">
              <Text className="font-bold text-lg">Hasta:</Text>
              <DateTimePicker
                value={closeMorning}
                mode="time"
                locale="es-ES"
                is24Hour={true}
                display="default"
                onChange={(event, selectedDate) => {
                  const currentTime = selectedDate || closeMorning;
                  setCloseMorning(currentTime);
                }}
              />
            </View>
          </View>
          <Text className="text-xl font-bold text-center mt-4 border-b-2">
            Turno de Tarde
          </Text>
          <View className="flex-row">
            <View className="flex-row p-2 m-2">
              <Text className="font-bold text-lg">De:</Text>
              <DateTimePicker
                value={openAfternoon}
                mode="time"
                locale="es-ES"
                is24Hour={true}
                display="default"
                onChange={(event, selectedDate) => {
                  const currentTime = selectedDate || openAfternoon;
                  setOpenAfternoon(currentTime);
                }}
              />
            </View>
            <View className="flex-row p-2 m-2">
              <Text className="font-bold text-lg">Hasta:</Text>
              <DateTimePicker
                value={closeAfternoon}
                mode="time"
                locale="es-ES"
                is24Hour={true}
                display="default"
                onChange={(event, selectedDate) => {
                  const currentTime = selectedDate || closeAfternoon;
                  setCloseAfternoon(currentTime);
                }}
              />
            </View>
          </View>
          <View className="flex-row items-center justify-center">
            <Text className="text-lg font-bold">Cerrado: </Text>
            <Switch
              value={isClosed}
              onValueChange={() => {
                setIsClosed(!isClosed);
              }}
              color="green"
              style={{ alignSelf: "center", marginVertical: 10 }}
            />
          </View>
          <View className="flex-row items-center justify-center gap-4 p-4">
            <TouchableOpacity className="bg-white rounded-xl p-2 border-2 mt-2 mb-2">
              <Text className="text-lg text-center font-bold">✅ Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setScheduleModalVisible(false)}
              className="bg-white rounded-xl p-2 border-2 mt-2 mb-2"
            >
              <Text className="text-lg text-center font-bold">❎ Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
