// import { collection, onSnapshot } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import { ScrollView } from "react-native";
// import Machine from "../components/Machine";
// import { db } from "../firebaseConfig";

// const Block1Machines = () => {
//   const [machines, setMachines] = useState([]);

//   useEffect(() => {
//     const unsubscribe = onSnapshot(collection(db, "machines"), (snapshot) => {
//       const data = snapshot.docs
//         .map(doc => ({ ...doc.data(), id: doc.id, image: require("../assets/washingMachine.jpeg") }))
//         .filter(machine => machine.location === "Block 1");

//       setMachines(data);
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <ScrollView>
//       {machines.map((machine, index) => (
//         <Machine
//           key={machine.id || index}
//           image={machine.image}
//           name={machine.displayName}
//           machineId={machine.id}
//           model={machine.model || "FBI208S6W"}
//           availability={machine.available}
//         />
//       ))}
//     </ScrollView>
//   );
// };

// export default Block1Machines;

import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Machine from "../components/Machine";
import { db } from "../firebaseConfig";

const Block1Machines = ({ showAvailableOnly }) => {
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "machines"),
      (snapshot) => {
        const data = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            image: require("../assets/washingMachine.jpeg"),
          }))
          .filter((m) => m.location === "Block 1");
        setMachines(data);
      }
    );
    return () => unsubscribe();
  }, []);

  // Apply the filter
  const displayed = showAvailableOnly
    ? machines.filter((m) => m.available)
    : machines;

  // If none match, show a placeholder message
  if (displayed.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text>No available machines at the moment</Text>
      </View>
    );
  }

  // Otherwise render the list
  return (
    <ScrollView>
      {displayed.map((machine) => (
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

export default Block1Machines;
