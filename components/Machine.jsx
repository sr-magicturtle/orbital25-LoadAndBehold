import { getAuth } from "firebase/auth";
import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, Image, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { db } from "../firebaseConfig";

const Machine = ({ image, name, model, availability, machineId }) => {
  const statusColor = availability === true ? "green" : "red";
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [queueCount, setQueueCount] = useState(0);

  const handleJoinQueue = async () => {
    setLoading(true);
    try {
      const user = getAuth().currentUser;
      if (!user) throw new Error("User not logged in");

      const queueDocRef = doc(db, "machines", machineId, "queue", user.uid);
      const queueSnap = await getDoc(queueDocRef);

      const userRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userRef);
      const userData = userDocSnap.exists() ? userDocSnap.data() : {};

      if (queueSnap.exists()) {
        Alert.alert("Already in Queue", "You’ve already joined the queue for this machine.");
      } else {
        await setDoc(queueDocRef, {
          name: userData.name || user.email,
          joinedAt: serverTimestamp(),
        });
        Alert.alert("Success", "You’ve joined the queue!");
        setModalOpen(false);
      }
    } catch (err) {
      console.error("Join Queue Error:", err);
      Alert.alert("Error", err.message || "Could not join queue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchQueueLength = async () => {
      if (modalOpen && machineId) {
        try {
          const snapshot = await getDocs(collection(db, "machines", machineId, "queue"));
          setQueueCount(snapshot.size);
        } catch (err) {
          console.error("Failed to fetch queue length", err);
        }
      }
    };

    fetchQueueLength();
  }, [modalOpen, machineId]);

  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} />

      <View>
        <Text style={styles.title}>{name}</Text>
        <Text>{model}</Text>
        <Text style={{ color: statusColor }}>Status: ●</Text>
      </View>

      <Modal transparent visible={modalOpen} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setModalOpen(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.queueLength}>{queueCount}</Text>
                <Text style={styles.inQueue}>in Queue</Text>
                <TouchableOpacity onPress={handleJoinQueue} style={styles.joinQueueButton} disabled={loading}>
                  <Text style={styles.closeQueueText}>{loading ? "Joining..." : "Join queue"}</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {!availability && (
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
    color: "black",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#C1E5FF",
    width: 300,
    height: 300,
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  queueLength: {
    fontSize: 100,
  },
  inQueue: {
    fontSize: 16,
    marginTop: 10,
  },
  joinQueueButton: {
    backgroundColor: "white",
    padding: 10,
    marginTop: 20,
    borderRadius: 8,
  },
});

export default Machine;
