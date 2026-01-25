import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.config";
import api from "../api/axios";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const googleProvider = new GoogleAuthProvider();

// ✅ Auth Provider
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Register
  const registerUser = async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  // ✅ Login with Email/Password + JWT
  const loginUser = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // 🔐 Backend JWT
    const res = await api.post("/api/auth/jwt", {
      email: user.email,
      role: "user",
    });

    localStorage.setItem("access-token", res.data.token);

    return result;
  };

  // ✅ Login with Google + JWT
  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const res = await api.post("/api/auth/jwt", {
      email: user.email,
      role: "user",
    });

    localStorage.setItem("access-token", res.data.token);

    return result;
  };

  // ✅ Logout
  const logout = async () => {
    localStorage.removeItem("access-token");
    return await signOut(auth);
  };

  // ✅ Auth State Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    loading,
    registerUser,
    loginUser,
    signInWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
