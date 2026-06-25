// Import React Router components
import { Routes, Route } from "react-router-dom";

// Import pages
import Landing from "../pages/Landing";
import Hero from "../pages/Hero";

// Import components
import Auth from "../components/Auth";
import ProtectedRoute from "../components/ProtectedRoute";

// Application routes
export default function AppRoutes() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<Landing />} />

      {/* Login */}
      <Route path="/login" element={<Auth />} />

      {/* Signup */}
      <Route path="/signup" element={<Auth />} />

      {/* Protected Hero Page */}
      <Route
        path="/hero"
        element={
          <ProtectedRoute>
            <Hero />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}