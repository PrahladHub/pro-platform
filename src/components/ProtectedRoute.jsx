import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requirePin = false }) => {
  const { isLoggedIn, isPinSet, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  // Agar login nahi hai toh login page par bhejo
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  // Agar PIN chahiye aur set nahi hai, toh Create PIN page par bhejo
  if (requirePin && !isPinSet) return <Navigate to="/create-pin" replace />;

  return children;
};

export default ProtectedRoute;