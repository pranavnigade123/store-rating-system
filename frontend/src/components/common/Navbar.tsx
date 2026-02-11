import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin, isUser, isOwner } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h1 className="text-lg font-bold text-slate-900">Store Rating</h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-1">
              {isAdmin && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/users"
                    className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Users
                  </Link>
                  <Link
                    to="/admin/stores"
                    className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Stores
                  </Link>
                </>
              )}
              
              {isUser && (
                <>
                  <Link
                    to="/user/stores"
                    className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Stores
                  </Link>
                  <Link
                    to="/user/change-password"
                    className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Settings
                  </Link>
                </>
              )}
              
              {isOwner && (
                <>
                  <Link
                    to="/owner/dashboard"
                    className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/owner/change-password"
                    className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Settings
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm hidden sm:block">
              <p className="text-slate-900 font-semibold">{user.name}</p>
              <p className="text-slate-500 text-xs">{user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden pb-3 flex gap-2 overflow-x-auto">
          {isAdmin && (
            <>
              <Link
                to="/admin/dashboard"
                className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/users"
                className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors"
              >
                Users
              </Link>
              <Link
                to="/admin/stores"
                className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors"
              >
                Stores
              </Link>
            </>
          )}
          
          {isUser && (
            <>
              <Link
                to="/user/stores"
                className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors"
              >
                Stores
              </Link>
              <Link
                to="/user/change-password"
                className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors"
              >
                Settings
              </Link>
            </>
          )}
          
          {isOwner && (
            <>
              <Link
                to="/owner/dashboard"
                className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/owner/change-password"
                className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors"
              >
                Settings
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
