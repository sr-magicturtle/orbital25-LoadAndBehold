import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../../components/header';
import { db } from '../../firebaseConfig';
import { getAuth } from 'firebase/auth';

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

        const querySnapshot = await getDocs(collection(db, 'users', user.uid, 'scans'));
        const data = querySnapshot.docs.map((doc) => {
          const d = doc.data();
          const dateObj = new Date(d.scannedAt);

          const date = dateObj.toLocaleDateString();
          const time = dateObj.toLocaleTimeString();

          const duration = 60; 
          let color = '#D3D3D3';
          if (duration < 15) color = '#C2F2D0';
          else if (duration <= 30) color = '#FFF6A6';
          else color = '#FFBABA';

          return {
            ...d,
            date,
            time,
            duration,
            color,
            scannedAt: dateObj, 
          };
        });

        // sort by most recent first 
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
        <Text style={styles.subHeading}>Machine Scan History</Text>

        {historyData.map((entry, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardContent}>
              <View>
                <Text style={styles.date}>
                  {entry.date} <Text style={{ color: 'green' }}>{entry.status === 'Ongoing' ? '(Ongoing)' : ''}</Text>
                </Text>
                <Text>Machine: {entry.machineId}</Text>
                <Text>Scanned At: {entry.time}</Text>
              </View>

              <View style={[styles.durationCircle, { backgroundColor: entry.color }]}>
                <Text style={styles.durationText}>{entry.duration}</Text>
                <Text>mins</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default HistoryPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#888',
    marginBottom: 10,
  },
  userCard: {
    backgroundColor: '#E6F2FF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
    alignSelf: 'flex-start',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  userId: {
    fontSize: 14,
  },
  subHeading: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  card: {
    marginBottom: 20,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  durationCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  durationText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
