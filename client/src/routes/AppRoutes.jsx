import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "../pages/Landing";
import Hero from "../pages/Hero";

import Auth from "../components/Auth";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<Landing />} />

      {/* Authentication */}
      <Route path="/login" element={<Auth />} />
      <Route path="/signup" element={<Auth />} />

      {/* Protected Hero */}
      <Route
        path="/hero"
        element={
          <ProtectedRoute>
            <Hero />
          </ProtectedRoute>
        }
      />

      {/* Redirect Unknown Routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}