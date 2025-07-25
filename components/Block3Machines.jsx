import { ScrollView, Text, View } from "react-native";
import Machine from "../components/Machine";

// Accept showAvailableOnly prop (default to false) to avoid red underline and enable filtering
const Block3Machines = ({ showAvailableOnly = false }) => {
    // Replace with your real data fetch or static list
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
        },
    ];

    // Filter if needed
    const displayed = showAvailableOnly
        ? machines.filter(m => m.availability)
        : machines;

    // Show placeholder if no machines available
    if (displayed.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
                <Text>No available machines at the moment</Text>
            </View>
        );
    }

    return (
        <ScrollView>
            {displayed.map((machine, idx) => (
                <Machine
                    key={idx}
                    image={machine.image}
                    name={machine.name}
                    machineId={machine.id}
                    model={machine.model}
                    availability={machine.availability}
                />
            ))}
        </ScrollView>
    );
};

export default Block3Machines;
