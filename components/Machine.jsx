import { View, Text, Image, StyleSheet } from "react-native";

const Machine = ({ image, name, model, status }) => {
  const statusColor = status === "available" ? "green" : "red";

  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} />
      <Text style={styles.title}>{name}</Text>
      <Text>{model}</Text>
      <Text style={{ color: statusColor }}>Status: ●</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 10,
    resizeMode: "contain",
  },
  title: {
    fontWeight: "bold",
  },
});

export default Machine;
