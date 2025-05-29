import { View, Text, StyleSheet, ScrollView } from "react-native"
import Machine from "./Machine";

const Block1Machines = () => {
    const machines = [
        {
            image: require("../assets/washingMachine.jpeg"),
            name: "Washer 1",
            model: "FBI208S6W",
            status: "available",
        },
        {
            image: require("../assets/washingMachine.jpeg"),
            name: "Washer 2",
            model: "FBI208S6W",
            status: "unavailable",
        }
    ]

    return (
        <ScrollView>
            {machines.map((machine,index) => (
                <Machine
                    key={index}
                    image={machine.image}
                    name={machine.name}
                    model={machine.model}
                    status={machine.status}
                />
            ))}
        </ScrollView>
    );
};

export default Block1Machines;