import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreatePin from './pages/CreatePin';
import Workspace from './pages/Workspace';

import Websites from './pages/Websites';
import WebsiteEditor from './pages/WebsiteEditor';
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

          {/* =====================================================
              PUBLIC STOREFRONT
          ===================================================== */}

          <Route
            path="/store/:storeSlug"
            element={<Storefront />}
          />

          <Route
            path="/store/:storeSlug/cart"
            element={<Cart />}
          />

          <Route
            path="/store/:storeSlug/checkout"
            element={<Checkout />}
          />


          {/* =====================================================
              AUTH
          ===================================================== */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />


          {/* =====================================================
              DASHBOARD
          ===================================================== */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />


          {/* =====================================================
              WEBSITES
          ===================================================== */}

          <Route
            path="/websites"
            element={
              <ProtectedRoute>
                <Websites />
              </ProtectedRoute>
            }
          />

          {/* Website Editor */}

          <Route
            path="/websites/edit/:id"
            element={
              <ProtectedRoute>
                <WebsiteEditor />
              </ProtectedRoute>
            }
          />

          {/* Create Website */}

          <Route
            path="/create-website"
            element={
              <ProtectedRoute>
                <CreateWebsite />
              </ProtectedRoute>
            }
          />


          {/* =====================================================
              PRODUCTS
          ===================================================== */}

          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />


          {/* =====================================================
              ORDERS
          ===================================================== */}

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />


          {/* =====================================================
              CUSTOMERS
          ===================================================== */}

          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <Customers />
              </ProtectedRoute>
            }
          />


          {/* =====================================================
              PAYMENTS
          ===================================================== */}

          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <Payments />
              </ProtectedRoute>
            }
          />


          {/* =====================================================
              MEDIA
          ===================================================== */}

          <Route
            path="/media"
            element={
              <ProtectedRoute>
                <Media />
              </ProtectedRoute>
            }
          />


          {/* =====================================================
              SETTINGS
          ===================================================== */}

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />


          {/* =====================================================
              BILLING
          ===================================================== */}

          <Route
            path="/billing"
            element={
              <ProtectedRoute>
                <Billing />
              </ProtectedRoute>
            }
          />


          {/* =====================================================
              ADMIN PANEL
          ===================================================== */}

          <Route
            path="/admin-panel"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />


          {/* =====================================================
              CREATE PIN
          ===================================================== */}

          <Route
            path="/create-pin"
            element={
              <ProtectedRoute>
                <CreatePin />
              </ProtectedRoute>
            }
          />


          {/* =====================================================
              WORKSPACE
          ===================================================== */}

          <Route
            path="/workspace"
            element={
              <ProtectedRoute requirePin={true}>
                <Workspace />
              </ProtectedRoute>
            }
          />


          {/* =====================================================
              DEFAULT
          ===================================================== */}

          <Route
            path="*"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;