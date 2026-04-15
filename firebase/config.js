import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDsUlNim4HMGIIT53qKIbK41w7CjrK_PY",
  authDomain: "carrykart-6837b.firebaseapp.com",
  projectId: "carrykart-6837b",
  storageBucket: "carrykart-6837b.appspot.com",
  messagingSenderId: "410610080619",
  appId: "1:410610080619:web:5e50ebca9d7f21f9b68a2e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
