import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreatePin from './pages/CreatePin';
import Workspace from './pages/Workspace';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes - Login zaroori hai */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />

          <Route path="/create-pin" element={
            <ProtectedRoute><CreatePin /></ProtectedRoute>
          } />

          {/* Workspace - Login + PIN dono zaroori */}
          <Route path="/workspace" element={
            <ProtectedRoute requirePin={true}><Workspace /></ProtectedRoute>
          } />

          {/* Default route - Login page par bhejo */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;