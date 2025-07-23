import { getAuth } from "firebase/auth";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export const fetchUserQueues = async () => {
    const user = getAuth().currentUser;
    if (!user) throw new Error("User not logged in");

    // Fetch studentId from user profile
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    const studentId = userDocSnap.exists() ? userDocSnap.data().studentId : null;

    const machineList = [];
    const machinesSnapshot = await getDocs(collection(db, "machines"));

    for (const machineDoc of machinesSnapshot.docs) {
        const machineId = machineDoc.id;

        const userQueueDocRef = doc(db, "machines", machineId, "queue", user.uid);
        const userQueueSnap = await getDoc(userQueueDocRef);

        if (userQueueSnap.exists()) {
            const queueSnapshot = await getDocs(collection(db, "machines", machineId, "queue"));

            // Sort by joinedAt
            const sorted = queueSnapshot.docs
                .filter(doc => doc.data().joinedAt)
                .sort((a, b) => a.data().joinedAt.seconds - b.data().joinedAt.seconds);

            const userIndex = sorted.findIndex(doc => doc.id === user.uid);
            const position = userIndex + 1;

            const machineData = machineDoc.data();

            machineList.push({
                machineId,
                displayName: machineData.displayName,
                location: machineData.location,
                model: machineData.model,
                position,
                studentId, // include it in case UI wants to show
            });
        }
    }

    return machineList;
};
