import { View, Text, StyleSheet, ScrollView } from "react-native"
import Machine from "../components/Machine";

const Block1Machines = () => {
    const machines = [
        {
            image: require("../assets/washingMachine.jpeg"),
            name: "Washer 1",
            model: "FBI208S6W",
            availability: true,
        },
        {
            image: require("../assets/washingMachine.jpeg"),
            name: "Washer 2",
            model: "FBI208S6W",
            availability: false,
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
                    availability={machine.availability}
                />
            ))}
        </ScrollView>
    );
};

export default Block1Machines;