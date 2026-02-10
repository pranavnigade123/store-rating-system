import express from 'express';
import { query } from '../db/pool.js';
import { authenticateToken } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

// All owner routes need auth + OWNER role
router.use(authenticateToken, authorize('OWNER'));

// Owner dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const ownerId = req.user.id;

    // find owner's store
    const storeResult = await query(
      `SELECT id, name, email, address, created_at
       FROM stores
       WHERE owner_user_id = $1`,
      [ownerId]
    );

    if (storeResult.rows.length === 0) {
      return res.status(404).json({
        error: {
          message: 'No store found for this owner',
          code: 'STORE_NOT_FOUND'
        }
      });
    }

    const store = storeResult.rows[0];

    // get ratings with user details
    const ratingsResult = await query(
      `SELECT 
        r.id, r.rating, r.created_at,
        u.id as user_id, u.name as user_name, u.email as user_email
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = $1
       ORDER BY r.created_at DESC`,
      [store.id]
    );

    // calculate average
    const avgResult = await query(
      `SELECT COALESCE(AVG(rating), 0) as average, COUNT(*) as total
       FROM ratings
       WHERE store_id = $1`,
      [store.id]
    );

    res.status(200).json({
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        created_at: store.created_at
      },
      averageRating: parseFloat(avgResult.rows[0].average).toFixed(2),
      totalRatings: parseInt(avgResult.rows[0].total),
      ratings: ratingsResult.rows
    });
  } catch (error) {
    console.error('Owner dashboard route error:', error);
    
    res.status(500).json({
      error: {
        message: 'Failed to fetch dashboard data',
        code: 'DASHBOARD_ERROR'
      }
    });
  }
});

export default router;
