import { createUserWithEmailAndPassword } from "firebase/auth";

const handleSignup = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    setUser({
      email: userCredential.user.email,
      role: "user"
    });

  } catch (e) {
    alert(e.message);
  }
};
