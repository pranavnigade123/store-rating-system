/**
 * Middleware factory to authorize users based on their roles
 * Must be used after authenticateToken middleware
 * @param {...string} allowedRoles - Roles that are allowed to access the route
 * @returns {Function} Express middleware function
 * 
 * @example
 * router.get('/admin/users', authenticateToken, authorize('ADMIN'), getUsers);
 * router.post('/stores/:id/rating', authenticateToken, authorize('USER'), submitRating);
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check if user is authenticated (should be set by authenticateToken middleware)
      if (!req.user) {
        return res.status(401).json({
          error: {
            message: 'Authentication required',
            code: 'NOT_AUTHENTICATED'
          }
        });
      }

      // Check if user's role is in the allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          error: {
            message: 'You do not have permission to access this resource',
            code: 'FORBIDDEN',
            details: {
              requiredRoles: allowedRoles,
              userRole: req.user.role
            }
          }
        });
      }

      // User is authorized, proceed to next middleware
      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({
        error: {
          message: 'Authorization check failed',
          code: 'AUTHORIZATION_ERROR'
        }
      });
    }
  };
};
