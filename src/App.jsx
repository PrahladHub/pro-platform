import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreatePin from './pages/CreatePin';
import Workspace from './pages/Workspace';
import Websites from './pages/Websites';
import CreateWebsite from './pages/CreateWebsite';
import Products from './pages/products';
import Orders from './pages/orders';
import Customers from './pages/customers';
import Payments from './pages/payments';
import Media from './pages/media';
import Settings from './pages/settings';
import Storefront from './pages/Storefront';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Billing from './pages/Billing';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Storefront */}
          <Route path="/store/:storeSlug" element={<Storefront />} />
          <Route path="/store/:storeSlug/cart" element={<Cart />} />
          <Route path="/store/:storeSlug/checkout" element={<Checkout />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin (Protected) */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/websites" element={<ProtectedRoute><Websites /></ProtectedRoute>} />
          <Route path="/create-website" element={<ProtectedRoute><CreateWebsite /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
          <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
          <Route path="/media" element={<ProtectedRoute><Media /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
          <Route path="/admin-panel" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
          <Route path="/create-pin" element={<ProtectedRoute><CreatePin /></ProtectedRoute>} />
          <Route path="/workspace" element={<ProtectedRoute requirePin={true}><Workspace /></ProtectedRoute>} />

          {/* Default */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;