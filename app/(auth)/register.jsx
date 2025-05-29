import { Link } from "expo-router"
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import Spacer from "../../components/Spacer"

const Register = () => {
    return (
        <View style={styles.container}> 
            <Text style={styles.title}>Register for account!</Text>

            <Spacer height={20} />

            <TextInput 
                style={styles.input} 
                placeholder="Username"
            />
            <TextInput 
                style={styles.input}
                placeholder="Password" 
            />

            <Spacer height={20} />

            <Link href="/login" asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonWords}>Register</Text>
                </TouchableOpacity>
            </Link>
        </View>
    )
}

export default Register;

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    title: {
        fontSize: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "purple",
        padding: 8,
        margin: 5,
        width: 300, 
        borderRadius: 10,
    },
    button: {
        height: 40,
        width: 100,
        backgroundColor: "#1C3A7C",
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonWords: {
        fontSize: 16,
        color: "#FFFFFF",
    },
})