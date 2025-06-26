import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import Block1Machines from "../../components/Block1Machines";
import Block2Machines from "../../components/Block2Machines";
import Block3Machines from "../../components/Block3Machines";
import Block4Machines from "../../components/Block4Machines";
import Header from "../../components/header";

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#F5FAFF",
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    color: "#1C3A7C",
  },
  dropdown: {
    height: 50,
    borderColor: "#B0C4DE",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  selectedText: {
    fontSize: 16,
    color: "#333",
  },
  machinesContainer: {
    marginTop: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
    color: "#444",
  },
});

export default function Homepage() {
  const [location, setLocation] = useState(null);

  const locations = [
    { name: "Block 1", key: "1", machines: ["Dryer 1", "Dryer 2"] },
    { name: "Block 2", key: "2", machines: ["Washer 1"] },
    { name: "Block 3", key: "3", machines: ["Washer 1", "Washer 2"] },
    { name: "Block 4", key: "4", machines: ["Washer 1", "Washer 2", "Washer 3"] }
  ];

  const selectedLocation = locations.find(loc => loc.key === location);

  return (
    <View style={styles.page}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Select Location</Text>

        <Dropdown
          style={styles.dropdown}
          data={locations}
          labelField="name"
          valueField="key"
          placeholder="Choose a block"
          placeholderStyle={{ color: "#aaa" }}
          selectedTextStyle={styles.selectedText}
          value={location}
          onChange={item => setLocation(item.key)}
        />

        {selectedLocation && (
          <View style={styles.machinesContainer}>
            <Text style={styles.subtitle}>Machines at {selectedLocation.name}</Text>
            {selectedLocation.key === "1" && <Block1Machines />}
            {selectedLocation.key === "2" && <Block2Machines />}
            {selectedLocation.key === "3" && <Block3Machines />}
            {selectedLocation.key === "4" && <Block4Machines />}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
