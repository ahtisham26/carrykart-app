import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (e) {
    console.log(e);
  }
};
