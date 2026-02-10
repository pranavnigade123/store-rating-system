import { verifyToken } from '../utils/jwt.js';

// Middleware to check JWT token
export const authenticateToken = (req, res, next) => {
  try {
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

    // verify the token
    const decoded = verifyToken(token);

    // attach user to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    
    return res.status(401).json({
      error: {
        message: error.message || 'Invalid or expired token',
        code: 'INVALID_TOKEN'
      }
    });
  }
};
