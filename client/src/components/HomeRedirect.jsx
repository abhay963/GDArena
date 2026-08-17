import { Navigate } from "react-router-dom";
import { useAuth} from "../context/AuthContext";
import Landing from "../pages/Landing";

function HomeRedirect() {
  const { user, loading } = useAuth();

  // Firebase is still restoring/checking the session
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  // Logged in → main application
  if (user) {
    return <Navigate to="/hero" replace />;
  }

  // Not logged in → landing page
  return <Landing />;
}

export default HomeRedirect;