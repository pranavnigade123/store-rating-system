import { verifyToken } from '../utils/jwt.js';

/**
 * Middleware to authenticate JWT token from request headers
 * Extracts token from Authorization header (Bearer token)
 * Verifies token and attaches user info to req.user
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const authenticateToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: {
          message: 'Access token is required',
          code: 'NO_TOKEN'
        }
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    // Attach user info to request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    
    return res.status(401).json({
      error: {
        message: error.message || 'Invalid or expired token',
        code: 'INVALID_TOKEN'
      }
    });
  }
};
