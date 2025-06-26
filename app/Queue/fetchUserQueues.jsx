import { getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";


export const fetchUserQueues = async () => {
    const user = getAuth().currentUser;
    if (!user) throw new Error("User not logged in");

    const machineList = [];
    const machinesSnapshot = await getDocs(collection(db, "machines"));

    for (const machineDoc of machinesSnapshot.docs) {
        const machineId = machineDoc.id;

        // Get the queue subcollection for this machine
        const queueSnapshot = await getDocs(collection(db, "machines", machineId, "queue"));

        // Sort the queue by joinedAt
        const sorted = queueSnapshot.docs
            .filter(doc => doc.data().joinedAt) // filter incomplete data
            .sort((a, b) => a.data().joinedAt.seconds - b.data().joinedAt.seconds);

        // Find this user's position
        const userIndex = sorted.findIndex(doc => doc.id === user.uid);
        if (userIndex !== -1) {
            const machineData = machineDoc.data();
            machineList.push({
                machineId,
                displayName: machineData.displayName,
                location: machineData.location,
                model: machineData.model,
                position: userIndex + 1,
            });
        }
    }

    return machineList;
};
