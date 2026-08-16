import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔥 Starting Firebase Auth Listener");

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        console.log(
          "🔥 Firebase User:",
          currentUser
            ? currentUser.email
            : "No user"
        );

        setUser(currentUser);
        setLoading(false);
      },
      (error) => {
        console.error(
          "🔥 Firebase Auth Error:",
          error
        );

        setUser(null);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}