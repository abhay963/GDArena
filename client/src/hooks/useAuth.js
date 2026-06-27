import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        console.log("Auth State:", currentUser);

        setUser(currentUser);
        setLoading(false);
      },
      (error) => {
        console.error("Auth Error:", error);

        setUser(null);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
  };
}