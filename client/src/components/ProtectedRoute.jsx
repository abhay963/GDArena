// Import Navigate component for redirection
import { Navigate } from "react-router-dom";

// Import custom authentication hook
import { useAuth } from "../hooks/useAuth";

// Protect routes from unauthenticated users
export default function ProtectedRoute({ children }) {
  // Get current user and loading state
  const { user, loading } = useAuth();

  // Wait until Firebase checks authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030014] text-white">
        Loading...
      </div>
    );
  }

  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render protected page
  return children;
}