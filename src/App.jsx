import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Customer Pages
import Home from './pages/customer/Home.jsx';
import Menu from './pages/customer/Menu.jsx';
import Cart from './pages/customer/Cart.jsx';
import Checkout from './pages/customer/Checkout.jsx';
import OrderSuccess from './pages/customer/OrderSuccess.jsx';
import TrackOrder from './pages/customer/TrackOrder.jsx';
import About from './pages/customer/About.jsx';
import Contact from './pages/customer/Contact.jsx';
import CustomerLogin from './pages/customer/Login.jsx';
import CustomerRegister from './pages/customer/Register.jsx';
import MyOrders from './pages/customer/MyOrders.jsx';

// Admin Pages
import AdminLogin from './pages/admin/Login.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import MenuManagement from './pages/admin/MenuManagement.jsx';
import Categories from './pages/admin/Categories.jsx';
import Orders from './pages/admin/Orders.jsx';
import OrderDetail from './pages/admin/OrderDetail.jsx';
import Billing from './pages/admin/Billing.jsx';
import Bills from './pages/admin/Bills.jsx';
import BillDetail from './pages/admin/BillDetail.jsx';
import Users from './pages/admin/Users.jsx';
import Customers from './pages/admin/Customers.jsx';
import Staff from './pages/admin/Staff.jsx';
import Settings from './pages/admin/Settings.jsx';
import Reports from './pages/admin/Reports.jsx';
import AdminProfile from './pages/admin/Profile.jsx';

// Layouts
import CustomerLayout from './components/layout/CustomerLayout.jsx';
import AdminLayout from './components/layout/AdminLayout.jsx';

// Hooks
import { useAuth } from './hooks/useAuth.js';

// Protected Route Components
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const CustomerProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <>
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1F1F1F',
            color: '#FFFFFF',
            border: '1px solid #262626'
          },
          success: {
            iconTheme: {
              primary: '#22C55E',
              secondary: '#FFFFFF'
            }
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF'
            }
          }
        }}
      />

      <Routes>
        {/* ==================== CUSTOMER ROUTES ==================== */}
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success/:orderNumber" element={<OrderSuccess />} />
          <Route path="track-order" element={<TrackOrder />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<CustomerLogin />} />
          <Route path="register" element={<CustomerRegister />} />
          <Route
            path="my-orders"
            element={
              <CustomerProtectedRoute>
                <MyOrders />
              </CustomerProtectedRoute>
            }
          />
        </Route>

        {/* ==================== ADMIN ROUTES ==================== */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin', 'staff']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="menu" element={<MenuManagement />} />
          <Route path="categories" element={<Categories />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="billing" element={<Billing />} />
          <Route path="bills" element={<Bills />} />
          <Route path="bills/:id" element={<BillDetail />} />
          <Route path="profile" element={<AdminProfile />} />
          
          {/* Admin Only Routes */}
          <Route
            path="users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="customers"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Customers />
              </ProtectedRoute>
            }
          />
          <Route
            path="staff"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Staff />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="reports"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Reports />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;