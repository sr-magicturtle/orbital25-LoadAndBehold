import { useState } from "react";
import { Platform, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Block1Machines from "../../components/Block1Machines";
import Block2Machines from "../../components/Block2Machines";
import Block3Machines from "../../components/Block3Machines";
import Block4Machines from "../../components/Block4Machines";
import Header from "../../components/header";

export default function Homepage() {
  const [location, setLocation] = useState(null);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const locations = [
    { name: "Block 1", key: "1" },
    { name: "Block 2", key: "2" },
    { name: "Block 3", key: "3" },
    { name: "Block 4", key: "4" },
  ];

  const selectedLocation = locations.find(loc => loc.key === location);

  return (
    <View style={styles.page}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Laundry Dashboard</Text>

        {/* Block Selection Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Select Block</Text>
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
        </View>

        {selectedLocation && (
          <>
            {/* Filter Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Machines at {selectedLocation.name}</Text>
              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Available Only</Text>
                <Switch
                  value={showAvailableOnly}
                  onValueChange={setShowAvailableOnly}
                  trackColor={{ false: '#ccc', true: '#4CAF50' }}
                  thumbColor={Platform.OS === 'android' ? '#fff' : undefined}
                />
              </View>
            </View>

            {/* Machines List */}
            <View style={styles.machinesContainer}>
              {selectedLocation.key === "1" && <Block1Machines showAvailableOnly={showAvailableOnly} />}
              {selectedLocation.key === "2" && <Block2Machines showAvailableOnly={showAvailableOnly} />}
              {selectedLocation.key === "3" && <Block3Machines showAvailableOnly={showAvailableOnly} />}
              {selectedLocation.key === "4" && <Block4Machines showAvailableOnly={showAvailableOnly} />}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#F0F4F8",
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1C3A7C",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  dropdown: {
    height: 50,
    borderColor: "#B0C4DE",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  selectedText: {
    fontSize: 16,
    color: "#333",
  },
  machinesContainer: {
    marginBottom: 40,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterLabel: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
});
