import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB6MMuGO_N1-TmSUMvukiVUz5gMv6KDUYs",
  authDomain: "signup-de50b.firebaseapp.com",
  projectId: "signup-de50b",
  storageBucket: "signup-de50b.appspot.com",
  messagingSenderId: "336921161672",
  appId: "1:336921161672:web:4bfbd068152825b1b81afd",
  measurementId: "G-4TF37M1QSG",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, firestore };
