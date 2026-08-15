import { Routes, Route } from "react-router-dom";

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
      <Route path="/" element={<Landing />} />

      <Route path="/login" element={<Auth />} />

      <Route path="/signup" element={<Auth />} />

      <Route path="/verify-email" element={<VerifyEmail />} />

      <Route
        path="/hero"
        element={
          <ProtectedRoute>
            <Hero />
          </ProtectedRoute>
        }
      />

<Route
  path="/studymate"
  element={
    <ProtectedRoute>
      <StudyMate />
    </ProtectedRoute>
  }
/>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;