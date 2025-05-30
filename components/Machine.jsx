import { View, Text, Image, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { useState } from "react";
import { Link } from "expo-router" 

const Machine = ({ image, name, model, availability }) => {
  const statusColor = availability === true ? "green" : "red";

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} />

      <View> 
        <Text style={styles.title}>{name}</Text>
        <Text>{model}</Text>
        <Text style={{ color: statusColor }}>Status: ●</Text>
      </View>

      <Modal
        transparent
        visible={modalOpen}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.queueLength}>1</Text>
            <Text style={styles.inQueue}>in Queue</Text>
            <TouchableOpacity onPress={() => setModalOpen(false)} style={styles.joinQueueButton}>
              <Text style={styles.closeQueueText}>Join queue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      { !availability && (
        <TouchableOpacity style={styles.queueButton} onPress={() => setModalOpen(true)}>
          <Text style={styles.queueText}>Queue</Text>
        </TouchableOpacity>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 5,
    marginTop: 10,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 100,
    marginBottom: 10,
    paddingHorizontal: 10,
    resizeMode: "contain",
  },
  title: {
    fontWeight: "bold",
  },
  queueButton: {
    backgroundColor: "#1C3A7C",
    padding: 5,
    borderRadius: 5,
    marginLeft: 20,
  },
  queueText: {
    color: "white",
  },
  closeQueueText: {
    color: 'black',
    fontWeight: 'bold'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // dim background
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#C1E5FF',
    width: 300,
    height: 300,
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: "center",
  },
  queueLength: {
    fontSize: 100,
  },
  joinQueueButton: {
    backgroundColor: 'white',
    padding: 10,
    marginTop: 20,
    borderRadius: 8
  }
});

export default Machine;
