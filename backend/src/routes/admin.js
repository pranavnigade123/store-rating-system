import express from 'express';
import { createUser, getUsers, getUserById } from '../services/userService.js';
import { createStore, getStores } from '../services/storeService.js';
import { validate, createUserSchema, createStoreSchema, paginationSchema } from '../validators/schemas.js';
import { authenticateToken } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { query } from '../db/pool.js';

const router = express.Router();

// All admin routes need auth + ADMIN role
router.use(authenticateToken, authorize('ADMIN'));

// Dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const usersCount = await query('SELECT COUNT(*) FROM users');
    const storesCount = await query('SELECT COUNT(*) FROM stores');
    const ratingsCount = await query('SELECT COUNT(*) FROM ratings');

    res.status(200).json({
      totalUsers: parseInt(usersCount.rows[0].count),
      totalStores: parseInt(storesCount.rows[0].count),
      totalRatings: parseInt(ratingsCount.rows[0].count)
    });
  } catch (error) {
    console.error('Dashboard route error:', error);
    
    res.status(500).json({
      error: {
        message: 'Failed to fetch dashboard data',
        code: 'DASHBOARD_ERROR'
      }
    });
  }
});

// Create user
router.post('/users', async (req, res) => {
  try {
    const validation = validate(createUserSchema, req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: validation.errors
        }
      });
    }

    const user = await createUser(validation.data);

    res.status(201).json({
      message: 'User created successfully',
      user
    });
  } catch (error) {
    console.error('Create user route error:', error);
    
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
        message: 'Failed to create user',
        code: 'CREATE_USER_ERROR'
      }
    });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const validation = validate(paginationSchema, req.query);
    
    if (!validation.success) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: validation.errors
        }
      });
    }

    const result = await getUsers(validation.data);

    res.status(200).json(result);
  } catch (error) {
    console.error('Get users route error:', error);
    
    res.status(500).json({
      error: {
        message: 'Failed to fetch users',
        code: 'GET_USERS_ERROR'
      }
    });
  }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await getUserById(id);

    res.status(200).json({ user });
  } catch (error) {
    console.error('Get user by ID route error:', error);
    
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
        message: 'Failed to fetch user',
        code: 'GET_USER_ERROR'
      }
    });
  }
});

// Create store
router.post('/stores', async (req, res) => {
  try {
    const validation = validate(createStoreSchema, req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: validation.errors
        }
      });
    }

    const store = await createStore(validation.data);

    res.status(201).json({
      message: 'Store created successfully',
      store
    });
  } catch (error) {
    console.error('Create store route error:', error);
    
    if (error.message === 'Store email already exists') {
      return res.status(409).json({
        error: {
          message: error.message,
          code: 'EMAIL_EXISTS'
        }
      });
    }

    if (error.message === 'Owner user not found') {
      return res.status(404).json({
        error: {
          message: error.message,
          code: 'OWNER_NOT_FOUND'
        }
      });
    }

    if (error.message === 'User must have OWNER role') {
      return res.status(400).json({
        error: {
          message: error.message,
          code: 'INVALID_OWNER_ROLE'
        }
      });
    }

    res.status(500).json({
      error: {
        message: 'Failed to create store',
        code: 'CREATE_STORE_ERROR'
      }
    });
  }
});

// Get all stores
router.get('/stores', async (req, res) => {
  try {
    const validation = validate(paginationSchema, req.query);
    
    if (!validation.success) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: validation.errors
        }
      });
    }

    const result = await getStores(validation.data);

    res.status(200).json(result);
  } catch (error) {
    console.error('Get stores route error:', error);
    
    res.status(500).json({
      error: {
        message: 'Failed to fetch stores',
        code: 'GET_STORES_ERROR'
      }
    });
  }
});

export default router;
