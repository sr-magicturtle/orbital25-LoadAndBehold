import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Spacer from "../../components/Spacer"

const profile = () => {
    return (
        <View style={styles.container}>
            <Image source={require("../../assets/portrait.jpg")} style={styles.pfp} />
            <Text style={styles.username}>James Tan Jun Jie</Text>
            <Text style={styles.studentId}>A0987654W</Text>
        </View>
    );
};

export default profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    pfp: {
        marginTop: 100,
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    username: {
        marginTop: 20,
        fontSize: 20,
        fontWeight: 500,
    },
    studentId: {
        marginTop: 5,
        fontSize: 15,
        fontWeight: 500,
        color:"#666"
    },
})