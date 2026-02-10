import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';

const DashboardPlaceholder = ({ role }: { role: string }) => {
  const { logout, user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Welcome, {user?.name}!</h1>
              <p className="text-gray-600">Role: {user?.role}</p>
            </div>
            <button
              onClick={() => {
                logout();
                window.location.href = '/login';
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
          <div className="text-center py-12">
            <h2 className="text-xl text-gray-600">{role} Dashboard (Coming Soon)</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

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
                <AdminDashboard />
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
            path="/user/*"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <DashboardPlaceholder role="User" />
              </ProtectedRoute>
            }
          />
          
          {/* Owner routes */}
          <Route
            path="/owner/*"
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <DashboardPlaceholder role="Owner" />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
