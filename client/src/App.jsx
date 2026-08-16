import { Routes, Route } from "react-router-dom";

import HomeRedirect from "./components/HomeRedirect";

import Landing from "./pages/Landing";
import Hero from "./pages/Hero";

import Auth from "./components/Auth";
import VerifyEmail from "./components/VerifyEmail";

import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound";

import StudyMate from "./pages/StudyMate";

function App() {
  return (
    <Routes>

      {/* Home */}
      <Route path="/" element={<HomeRedirect />} />

      {/* Landing page */}
      <Route path="/landing" element={<Landing />} />

      {/* Authentication */}
      <Route path="/login" element={<Auth />} />
      <Route path="/signup" element={<Auth />} />

      {/* Email verification */}
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Main application */}
      <Route
        path="/hero"
        element={
          <ProtectedRoute>
            <Hero />
          </ProtectedRoute>
        }
      />

      {/* StudyMate */}
      <Route
        path="/studymate"
        element={
          <ProtectedRoute>
            <StudyMate />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

export default App;