import express from 'express';
import { signup, login, changePassword } from '../services/authService.js';
import { validate, signupSchema, loginSchema, changePasswordSchema } from '../validators/schemas.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Signup endpoint
router.post('/signup', async (req, res) => {
  try {
    const validation = validate(signupSchema, req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: validation.errors
        }
      });
    }

    const user = await signup(validation.data);

    res.status(201).json({
      message: 'User registered successfully',
      user
    });
  } catch (error) {
    console.error('Signup route error:', error);
    
    if (error.message === 'Email already exists') {
      return res.status(409).json({
        error: {
          message: error.message,
          code: 'EMAIL_EXISTS'
        }
      });
    }

    res.status(500).json({
      error: {
        message: 'Failed to register user',
        code: 'SIGNUP_ERROR'
      }
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const validation = validate(loginSchema, req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: validation.errors
        }
      });
    }

    const { email, password } = validation.data;
    const result = await login(email, password);

    res.status(200).json({
      message: 'Login successful',
      ...result
    });
  } catch (error) {
    console.error('Login route error:', error);
    
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({
        error: {
          message: error.message,
          code: 'INVALID_CREDENTIALS'
        }
      });
    }

    res.status(500).json({
      error: {
        message: 'Failed to login',
        code: 'LOGIN_ERROR'
      }
    });
  }
});

// Change password - requires auth
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const validation = validate(changePasswordSchema, req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: validation.errors
        }
      });
    }

    const { currentPassword, newPassword } = validation.data;
    const result = await changePassword(req.user.id, currentPassword, newPassword);

    res.status(200).json(result);
  } catch (error) {
    console.error('Change password route error:', error);
    
    if (error.message === 'Current password is incorrect') {
      return res.status(401).json({
        error: {
          message: error.message,
          code: 'INVALID_PASSWORD'
        }
      });
    }

    if (error.message === 'User not found') {
      return res.status(404).json({
        error: {
          message: error.message,
          code: 'USER_NOT_FOUND'
        }
      });
    }

    res.status(500).json({
      error: {
        message: 'Failed to change password',
        code: 'CHANGE_PASSWORD_ERROR'
      }
    });
  }
});

export default router;
