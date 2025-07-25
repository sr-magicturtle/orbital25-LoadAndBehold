import { ScrollView, StyleSheet, Text, View } from "react-native";
import Machine from "../components/Machine";

// Accept showAvailableOnly prop to avoid red underline and enable filtering
const Block4Machines = ({ showAvailableOnly = false }) => {
    // Static list of Block 4 machines
    const machines = [
        {
            image: require("../assets/washingMachine.jpeg"),
            name: "Block 4 Washer 1",
            model: "FBI208S6W",
            availability: true,
        },
        {
            image: require("../assets/washingMachine.jpeg"),
            name: "Block 4 Washer 2",
            model: "FBI208S6W",
            availability: false,
        },
        {
            image: require("../assets/washingMachine.jpeg"),
            name: "Block 4 Washer 3",
            model: "FBI208S6W",
            availability: true,
        },
    ];

    // Filter based on availability
    const displayed = showAvailableOnly
        ? machines.filter(m => m.availability)
        : machines;

    // Show placeholder if no machines available
    if (displayed.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No available machines at the moment</Text>
            </View>
        );
    }

    return (
        <ScrollView>
            {displayed.map((machine, index) => (
                <Machine
                    key={index}
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

export default Block4Machines;
