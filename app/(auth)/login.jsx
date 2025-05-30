import { Link } from "expo-router" 
import { StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native'
import Spacer from "../../components/Spacer"

const Login = () => {
    return (
        <View style={styles.container}> 
            <Text style={styles.title}>Sign in</Text>

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

            <Link href="/homepage" asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonWords}>Login</Text>
                </TouchableOpacity>
            </Link>

             <Spacer height={50} />
             <Link href="/register"> 
                <Text style={{ textAlign: "center" }}>
                    {"Dont have an account?\nRegister here"}
                </Text>
          
             </Link>
        
        </View>
    )
}

export default Login;

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
        borderColor: "black",
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