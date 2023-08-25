import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAAXWPUKqPa9NmoQeAy8ZyGXqJxgy1hqj4",
  authDomain: "ne-a4491.firebaseapp.com",
  projectId: "ne-a4491",
  storageBucket: "ne-a4491.appspot.com",
  messagingSenderId: "1095018003080",
  appId: "1:1095018003080:web:af941a93a4cbd25c7dbd3d",
  measurementId: "G-YLJ4RFKSPW"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
export const db = firebase.firestore();

// Initialize Authentication
export const auth = firebase.auth();

