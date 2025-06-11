import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from "../../components/header";
import { db } from '../../firebaseConfig';

const HistoryPage = () => {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'history'));
        const data = querySnapshot.docs.map(doc => {
          const d = doc.data();

          // Parse the times
          const end = new Date(`1970-01-01T${d.endTime}`);
          const cycleEnd = new Date(`1970-01-01T${d.cycleEndTime}`);

          // Calculate duration (in minutes)
          const diffMs = cycleEnd - end;
          const duration = Math.max(Math.round(diffMs / 60000), 0); // fallback to 0

          // Determine color
          let color = '#D3D3D3'; // default
          if (duration < 15) color = '#C2F2D0';
          else if (duration <= 30) color = '#FFF6A6';
          else if (duration > 30) color = '#FFBABA';

          return {
            ...d,
            duration: isNaN(duration) ? '-' : duration,
            color,
          };
        });

        setHistoryData(data);
      } catch (err) {
        console.error('Error fetching history:', err);
      }
    };

    fetchHistory();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <ScrollView style={styles.container}>
        <Text style={styles.subHeading}>History</Text>

        {historyData.map((entry, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardContent}>
              <View>
                <Text style={styles.date}>
                  {entry.date}{' '}
                  {entry.status === 'Ongoing' && (
                    <Text style={{ color: 'green' }}>(Ongoing)</Text>
                  )}
                </Text>
                <Text>{entry.location}</Text>
                <Text>Start Time: {entry.startTime}</Text>
                <Text>End Time: {entry.endTime}</Text>
                <Text>Cycle End Time: {entry.cycleEndTime}</Text>
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
    width: '100%', // ✅ full width
    alignSelf: 'flex-start', // ✅ left aligned
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
