import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const message = (location.state as any)?.message;

  // redirect to dashboard if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (user.role === 'USER') {
        navigate('/user/stores');
      } else if (user.role === 'OWNER') {
        navigate('/owner/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error?.message || 'Login failed. Please check your credentials.';
      setError(errorMsg);
      setPassword(''); // clear password for security
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 w-full max-w-md">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Store Rating</h2>
          </div>
          <p className="text-sm text-slate-600">Sign in to your account</p>
        </div>
        
        {/* Demo Credentials */}
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="font-semibold text-orange-900 mb-3 text-sm">Demo Accounts (Click to copy)</p>
          <div className="space-y-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setEmail('admin@storerating.com');
                setPassword('Demo@123');
              }}
              className="w-full text-left p-2 hover:bg-orange-100 rounded transition-colors"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-700">Admin</span>
                <span className="text-slate-600">admin@storerating.com</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('pranav.nigade@gmail.com');
                setPassword('Demo@123');
              }}
              className="w-full text-left p-2 hover:bg-orange-100 rounded transition-colors"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-700">User</span>
                <span className="text-slate-600">pranav.nigade@gmail.com</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('pranav.nigade@business.com');
                setPassword('Demo@123');
              }}
              className="w-full text-left p-2 hover:bg-orange-100 rounded transition-colors"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-700">Owner</span>
                <span className="text-slate-600">pranav.nigade@business.com</span>
              </div>
            </button>
            <div className="pt-2 border-t border-orange-200 px-2 text-slate-600">
              Password: Demo@123
            </div>
          </div>
        </div>
        
        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm">
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={loading}
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            disabled={loading}
          />

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <a href="/signup" className="text-orange-600 hover:text-orange-700 font-semibold">
            Create account
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
