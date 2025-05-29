import { useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import Header from "../../components/header";
import Block1Machines from "../../components/Block1Machines";
import Block2Machines from "../../components/Block2Machines";
import Block3Machines from "../../components/Block3Machines";
import Block4Machines from "../../components/Block4Machines";

export default function homepage() {
  const [location, setLocation] = useState(null);

  const locations = [
    { name: "Block 1", key: "1", machines: ["Dryer 1", "Dryer 2"] },
    { name: "Block 2", key: "2", machines: ["Washer 1"] },
    { name: "Block 3", key: "3", machines: ["Washer 1", "Washer 2"] },
    { name: "Block 4", key: "4", machines: ["Washer 1", "Washer 2", "Washer 3"]}
  ]

  const selectedLocation = locations.find(loc => loc.key === location);

  return (
    <View>
      <Header />

      <View style={styles.container}>
        <Text>Location:</Text>

        <Dropdown
          style={styles.dropdown}
          data={locations}
          labelField="name"
          valueField="key"
          placeholder="Select location"
          value={location}
          onChange={item => setLocation(item.key)}
        />

        {selectedLocation && (
          <View>
            <Text style={styles.machineAt}>Machines at {selectedLocation.name}:</Text>
            {selectedLocation.key === "1" && <Block1Machines />}
            {selectedLocation.key === "2" && <Block2Machines />}
            {selectedLocation.key === "3" && <Block3Machines />}
            {selectedLocation.key === "4" && <Block4Machines />}
          </View>
        )}

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  dropdown: {
    height: 40,
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  machineAt: {
    paddingTop: 10,
  }
})