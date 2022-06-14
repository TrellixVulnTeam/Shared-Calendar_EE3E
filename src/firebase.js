// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAb0x1CNgaTwVdXe6EWLIIS6UeTXw15FHQ",
  authDomain: "timetree-9b2bb.firebaseapp.com",
  projectId: "timetree-9b2bb",
  storageBucket: "timetree-9b2bb.appspot.com",
  messagingSenderId: "1028589791660",
  appId: "1:1028589791660:web:402308c1dcebfeb5527209",
  measurementId: "G-7GN3S71T3E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

const db = getFirestore(app);

export { auth };
export default db;