// Import Firebase auth listener
import { onAuthStateChanged } from "firebase/auth";

// Import React hooks
import { useEffect, useState } from "react";

// Import Firebase auth instance
import { auth } from "../firebase/firebase";

// Custom hook for authentication
export function useAuth() {
  // Store logged-in user
  const [user, setUser] = useState(null);

  // Indicates whether Firebase is still checking auth state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Update current user
      setUser(currentUser);

      // Authentication check completed
      setLoading(false);
    });

    // Remove listener when component unmounts
    return () => unsubscribe();
  }, []);

  // Return auth state
  return {
    user,
    loading,
  };
}