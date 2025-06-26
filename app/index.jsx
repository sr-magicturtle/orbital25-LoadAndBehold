import { Link } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Spacer from "../components/Spacer";

export default function Index() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={require("../assets/nuslogo.png")} style={styles.image} />
                <Text style={styles.title}>Welcome to</Text>
                <Text style={styles.titleBold}>WasherWatcher</Text>
            </View>

            <Spacer height={40} />
            <Text style={styles.loginPrompt}>Login as:</Text>
            <Spacer height={20} />

            <Link href="/login" asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>NUS Student</Text>
                </TouchableOpacity>
            </Link>

            <Spacer height={16} />

            <Link href="/register" asChild>
                <TouchableOpacity style={styles.buttonOutline}>
                    <Text style={styles.buttonOutlineText}>NUS Staff / Visitor</Text>
                </TouchableOpacity>
            </Link>

            <Spacer height={30} />

            <Text style={styles.skipText}>Just exploring?</Text>
            <Link href="/(dashboard)/homepage" asChild>
                <TouchableOpacity style={styles.skipButton}>
                    <Text style={styles.skipButtonText}>Skip Sign In</Text>
                </TouchableOpacity>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EAF6FF",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
    header: {
        alignItems: "center",
        marginBottom: 20,
    },
    image: {
        width: 160,
        height: 120,
        resizeMode: "contain",
        marginBottom: 10,
    },
    title: {
        fontSize: 22,
        color: "#333",
    },
    titleBold: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#1C3A7C",
    },
    loginPrompt: {
        fontSize: 18,
        fontWeight: "500",
        color: "#555",
        marginBottom: 8,
    },
    button: {
        height: 50,
        width: "100%",
        backgroundColor: "#1C3A7C",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        fontSize: 18,
        color: "#FFFFFF",
        fontWeight: "600",
    },
    buttonOutline: {
        height: 50,
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderColor: "#1C3A7C",
        borderWidth: 2,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonOutlineText: {
        fontSize: 18,
        color: "#1C3A7C",
        fontWeight: "600",
    },
    skipText: {
        fontSize: 14,
        color: "#666",
        marginBottom: 8,
    },
    skipButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#A6C9E2",
        borderRadius: 10,
    },
    skipButtonText: {
        color: "#1C3A7C",
        fontWeight: "600",
    },
});
