// import { initializeApp } from "firebase/app";
// import { getFirestore } from 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: "AIzaSyBXEra3oQVlDTfxpF541hyBlyPvCivymac",
//   authDomain: "washerwatcher-11e05.firebaseapp.com",
//   projectId: "washerwatcher-11e05",
//   storageBucket: "washerwatcher-11e05.firebasestorage.app",
//   messagingSenderId: "96533122149",
//   appId: "1:96533122149:web:c0385f587c9d57033a0a8c"
// };

// const app = initializeApp(firebaseConfig);

// export default app;
// export const db = getFirestore(app);

import { getReactNativePersistence, initializeAuth } from '@firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBXEra3oQVlDTfxpF541hyBlyPvCivymac",
  authDomain: "washerwatcher-11e05.firebaseapp.com",
  projectId: "washerwatcher-11e05",
  storageBucket: "washerwatcher-11e05.appspot.com",
  messagingSenderId: "96533122149",
  appId: "1:96533122149:web:c0385f587c9d57033a0a8c"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { app, auth, db };
