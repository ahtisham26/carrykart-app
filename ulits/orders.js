import { db } from "../firebase/config";
import { collection, addDoc, getDocs } from "firebase/firestore";

export const createOrder = async (order) => {
  await addDoc(collection(db, "orders"), order);
};

export const getOrders = async () => {
  const snap = await getDocs(collection(db, "orders"));
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
