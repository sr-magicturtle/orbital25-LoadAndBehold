import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import Header from "../../components/header";

export default function homepage() {
  const [location, setLocation] = useState(null);

  const locations = [
    { name: "Block 1", key: "1", machines: ["Dryer 1", "Dryer 2"] },
    { name: "Block 2", key: "2", machines: ["Washer 1"] },
    { name: "Block 3", key: "3", machines: ["Washer 1", "Washer 2"] },
    { name: "Block 4", key: "4", machines: ["Washer 1", "Washer 2", "Washer 3"]},
    { name: "my shayla", key: "1000", machines: ["sign up for raffles hall rag"]},
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
            {selectedLocation.machines.map( (machine, index) => (
              <Text key={index}>{machine}</Text>
            ))}
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