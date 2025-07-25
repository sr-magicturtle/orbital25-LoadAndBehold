import { ScrollView } from "react-native";
import Machine from "./Machine";

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
            {machines.map((machine, index) => (
                <Machine
                    key={machine.id || index}
                    image={machine.image}
                    name={machine.displayName}
                    machineId={machine.id}
                    model={machine.model}
                    availability={machine.available}
                />
            ))}
        </ScrollView>
    );
};

export default Block1Machines;