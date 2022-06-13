import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth'
import {
  getFirestore,
  collection,
  getDocs,
  where,
  query,
  setDoc,
} from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBZfR2JcLKavjLnIjac-HehcOG3VAjIly4',
  authDomain: 'investment-tracker-f7024.firebaseapp.com',
  projectId: 'investment-tracker-f7024',
  storageBucket: 'investment-tracker-f7024.appspot.com',
  messagingSenderId: '670553908813',
  appId: '1:670553908813:web:5d94403c71dd9e6e3d1e04',
}

// Initialize Firebase
let app
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApp()
}

const db = getFirestore(app)

export {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  db,
  collection,
  getDocs,
  where,
  query,
  setDoc,
}
