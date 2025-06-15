import { View, ScrollView } from "react-native";
import Machine from "../components/Machine";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";

const Block1Machines = () => {
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "machines"), (snapshot) => {
      const data = snapshot.docs
        .map(doc => ({ ...doc.data(), id: doc.id, image: require("../assets/washingMachine.jpeg") }))
        .filter(machine => machine.location === "Block 1"); 

      setMachines(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ScrollView>
      {machines.map((machine, index) => (
        <Machine
          key={machine.id || index}
          image={machine.image}
          name={machine.displayName || machine.id}
          model={machine.model || "FBI208S6W"}
          availability={machine.available}
        />
      ))}
    </ScrollView>
  );
};

export default Block1Machines;