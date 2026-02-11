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
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-lg sm:text-xl font-bold text-gray-800">Store Rating System</h1>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex ml-6 lg:ml-10 space-x-2 lg:space-x-4">
              {isAdmin && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="text-gray-700 hover:text-blue-600 px-2 lg:px-3 py-2 rounded text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/users"
                    className="text-gray-700 hover:text-blue-600 px-2 lg:px-3 py-2 rounded text-sm font-medium"
                  >
                    Users
                  </Link>
                  <Link
                    to="/admin/stores"
                    className="text-gray-700 hover:text-blue-600 px-2 lg:px-3 py-2 rounded text-sm font-medium"
                  >
                    Stores
                  </Link>
                </>
              )}
              
              {isUser && (
                <>
                  <Link
                    to="/user/stores"
                    className="text-gray-700 hover:text-blue-600 px-2 lg:px-3 py-2 rounded text-sm font-medium"
                  >
                    Stores
                  </Link>
                  <Link
                    to="/user/change-password"
                    className="text-gray-700 hover:text-blue-600 px-2 lg:px-3 py-2 rounded text-sm font-medium"
                  >
                    Password
                  </Link>
                </>
              )}
              
              {isOwner && (
                <>
                  <Link
                    to="/owner/dashboard"
                    className="text-gray-700 hover:text-blue-600 px-2 lg:px-3 py-2 rounded text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/owner/change-password"
                    className="text-gray-700 hover:text-blue-600 px-2 lg:px-3 py-2 rounded text-sm font-medium"
                  >
                    Password
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="text-sm hidden sm:block">
              <p className="text-gray-700 font-medium truncate max-w-[120px] lg:max-w-none">{user.name}</p>
              <p className="text-gray-500 text-xs">{user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-2 rounded text-sm font-medium"
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
                className="text-gray-700 hover:text-blue-600 px-3 py-1 rounded text-sm whitespace-nowrap"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/users"
                className="text-gray-700 hover:text-blue-600 px-3 py-1 rounded text-sm whitespace-nowrap"
              >
                Users
              </Link>
              <Link
                to="/admin/stores"
                className="text-gray-700 hover:text-blue-600 px-3 py-1 rounded text-sm whitespace-nowrap"
              >
                Stores
              </Link>
            </>
          )}
          
          {isUser && (
            <>
              <Link
                to="/user/stores"
                className="text-gray-700 hover:text-blue-600 px-3 py-1 rounded text-sm whitespace-nowrap"
              >
                Browse Stores
              </Link>
              <Link
                to="/user/change-password"
                className="text-gray-700 hover:text-blue-600 px-3 py-1 rounded text-sm whitespace-nowrap"
              >
                Change Password
              </Link>
            </>
          )}
          
          {isOwner && (
            <>
              <Link
                to="/owner/dashboard"
                className="text-gray-700 hover:text-blue-600 px-3 py-1 rounded text-sm whitespace-nowrap"
              >
                My Store
              </Link>
              <Link
                to="/owner/change-password"
                className="text-gray-700 hover:text-blue-600 px-3 py-1 rounded text-sm whitespace-nowrap"
              >
                Change Password
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
