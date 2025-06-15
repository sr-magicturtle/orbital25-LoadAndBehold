import { Link } from "expo-router"
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native"
import Spacer from "../components/Spacer"

export default function Index() {
    return (
        <View style={styles.container}> 
            <Image source={require("../assets/nuslogo.png")} style={styles.image} />
            <Text style={styles.title}>Welcome to WasherWatcher!</Text>

            <Text style={styles.login}>Login as</Text>
            <Spacer height={10} />

            <Link href="/login" asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonWords}>NUS Student</Text>
                </TouchableOpacity>
            </Link>

            <Spacer height={10} />
                
            <Link href="/register" asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonWords}>NUS Staff/Visitor</Text>
                </TouchableOpacity>
            </Link>

            <Spacer height={10} />

            <Link href="/(dashboard)/homepage" asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonWords}>Skip Sign In</Text>
                </TouchableOpacity>
            </Link>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EAF6FF",
        alignItems: "center", 
    },
    image: {
        marginTop: 100, 
        width: 300,
        height: 200,
    },
    title: {
        color: "black",
        fontSize: 24,
    },
    login: {
        marginTop: 220,
        fontSize: 20,
        color: "black",
    },
    button: {
        height: 50,
        width: 300,
        backgroundColor: "#1C3A7C",
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonWords: {
        fontSize: 20,
        color: "#FFFFFF",
    },
})