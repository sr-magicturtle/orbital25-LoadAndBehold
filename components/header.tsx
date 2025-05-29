import { StyleSheet, Text, View } from "react-native";

export default function Header() {
    return (
        <View style={styles.container}>
            <Text style={styles.username}>James Tan Jun Jie</Text>
            <Text style={styles.studentId}>A0987654W</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#E9F5FF",
        height: 135,
        paddingHorizontal: 20,
        paddingVertical: 20,
        justifyContent: "flex-end",
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
