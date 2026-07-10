import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Hero from "./pages/Hero";
import Auth from "./components/Auth";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/signup" element={<Auth />} />

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

export default App;