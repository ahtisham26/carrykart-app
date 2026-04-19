import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/config";

export const createOrder = async (user, order) => {
  await addDoc(collection(db, "orders"), {
    ...order,
    userEmail: user.email,
    createdAt: new Date(),
  });
};
