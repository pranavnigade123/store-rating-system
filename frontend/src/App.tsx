import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/common/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminStores from './pages/AdminStores';
import UserStores from './pages/UserStores';
import OwnerDashboard from './pages/OwnerDashboard';
import ChangePassword from './pages/ChangePassword';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Layout>
                  <AdminUsers />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/stores"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Layout>
                  <AdminStores />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Navigate to="/admin/dashboard" replace />
              </ProtectedRoute>
            }
          />
          
          {/* User routes */}
          <Route
            path="/user/stores"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <Layout>
                  <UserStores />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/change-password"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <Layout>
                  <ChangePassword />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/*"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <Navigate to="/user/stores" replace />
              </ProtectedRoute>
            }
          />
          
          {/* Owner routes */}
          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <Layout>
                  <OwnerDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/change-password"
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <Layout>
                  <ChangePassword />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/*"
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <Navigate to="/owner/dashboard" replace />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
