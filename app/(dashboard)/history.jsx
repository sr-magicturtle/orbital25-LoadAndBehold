import { getAuth } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../../components/header';
import { db } from '../../firebaseConfig';

const HistoryPage = () => {
  const [historyData, setHistoryData] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.warn('User not authenticated');
          return;
        }

        const querySnapshot = await getDocs(
          collection(db, 'users', user.uid, 'scans')
        );

        const data = querySnapshot.docs.map((doc) => {
          const d = doc.data();
          const scannedAt = d.scannedAt?.toDate?.();
          const cycleEnd = d.cycleEnd?.toDate?.();
          const collectionTime = d.collectionTime?.toDate?.();

          let duration = null;
          let status = 'Missing Info';

          if (cycleEnd && collectionTime) {
            duration = Math.round((collectionTime - cycleEnd) / 60000);
            status = 'Completed';
          } else if (cycleEnd && !collectionTime) {
            status = 'Ongoing';
          }

          let color = '#D3D3D3';
          if (duration !== null) {
            if (duration < 15) color = '#C2F2D0';
            else if (duration <= 30) color = '#FFF6A6';
            else color = '#FFBABA';
          }

          return {
            ...d,
            scannedAt,
            date: scannedAt
              ? scannedAt.toLocaleDateString()
              : 'Invalid Date',
            time: scannedAt
              ? scannedAt.toLocaleTimeString()
              : 'Invalid Time',
            duration,
            color,
            status,
          };
        });

        // sort newest first
        data.sort((a, b) => b.scannedAt - a.scannedAt);
        setHistoryData(data);
      } catch (err) {
        console.error('Error fetching scan history:', err);
      }
    };

    fetchHistory();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <ScrollView style={styles.container}>
        {/* Renamed heading */}
        <Text style={styles.heading}>Wash History</Text>
        {/* Total washes count */}
        <Text style={styles.subheading}>
          Total Washes: {historyData.length}
        </Text>

        {historyData.map((entry, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardContent}>
              <View>
                <Text style={styles.date}>{entry.date}</Text>
                <Text style={styles.detail}>
                  Machine: {entry.machineId}
                </Text>
                <Text style={styles.detail}>
                  Scanned At: {entry.time}
                </Text>
                <Text
                  style={[
                    styles.status,
                    getStatusStyle(entry.status),
                  ]}>
                  {entry.status}
                </Text>
              </View>

              {entry.duration !== null && (
                <View
                  style={[
                    styles.durationCircle,
                    { backgroundColor: entry.color },
                  ]}>
                  <Text style={styles.durationText}>
                    {entry.duration}
                  </Text>
                  <Text style={styles.durationUnit}>mins</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default HistoryPage;

const getStatusStyle = (status) => {
  switch (status) {
    case 'Completed':
      return { color: 'green' };
    case 'Ongoing':
      return { color: '#FFA500' }; // orange
    case 'Missing Info':
      return { color: 'red' };
    default:
      return { color: '#555' };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FBFF',
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1C3A7C',
  },
  subheading: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C3A7C',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  detail: {
    fontSize: 14,
    color: '#555',
  },
  status: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: 'bold',
  },
  durationCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  durationText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  durationUnit: {
    fontSize: 12,
    color: '#333',
  },
});
