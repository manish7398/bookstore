import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import api from "../api/axios";

const loginUser = async (email, password) => {
  // Firebase login
  const result = await signInWithEmailAndPassword(auth, email, password);
  const user = result.user;

  // Backend JWT
  const res = await api.post("/api/auth/jwt", {
    email: user.email,
    role: "user", // later admin banayenge
  });

  localStorage.setItem("access-token", res.data.token);
};

export default loginUser;
