import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Machine from "../components/Machine";
import { db } from "../firebaseConfig";

const Block2Machines = ({ showAvailableOnly }) => {
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "machines"),
      (snapshot) => {
        const data = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
            image: require("../assets/washingMachine.jpeg"),
          }))
          .filter(machine => machine.location === "Block 2");

        setMachines(data);
      }
    );

    return () => unsubscribe();
  }, []);

  const displayed = showAvailableOnly
    ? machines.filter(m => m.available)
    : machines;

  if (displayed.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No available machines at the moment
        </Text>
      </View>
    );
  }

  return (
    <ScrollView>
      {displayed.map(machine => (
        <Machine
          key={machine.id}
          image={machine.image}
          name={machine.displayName}
          machineId={machine.id}
          model={machine.model || "FBI208S6W"}
          availability={machine.available}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#777",
  },
});

export default Block2Machines;
