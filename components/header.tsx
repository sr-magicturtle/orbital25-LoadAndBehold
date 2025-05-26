import { StyleSheet, Text, View } from "react-native";

export default function Header() {
    return (
        <View style={styles.container}>
            <Text style={styles.username}>James Tan Jun Jie</Text>
            <Text style={styles.studentId}>A09876654W</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#E9F5FF",
        height: 80,
        paddingHorizontal: 20,
        justifyContent: "center",
        alignItems: "flex-start",
    },
    username: {
        fontSize: 20,
        fontWeight: 500,
    },
    studentId: {
        marginTop: 3,
        fontSize: 15,
        fontWeight: 500,
        color:"#666"
    },
})
