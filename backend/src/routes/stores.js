import express from 'express';
import { getStores } from '../services/storeService.js';
import { submitRating, getUserRatingForStore } from '../services/ratingService.js';
import { validate, ratingSchema, paginationSchema } from '../validators/schemas.js';
import { authenticateToken } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

// Browse stores - public/authenticated
router.get('/', async (req, res) => {
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

// Submit/update rating - USER only
router.post('/:id/rating', authenticateToken, authorize('USER'), async (req, res) => {
  try {
    const { id: storeId } = req.params;
    const { rating } = req.body;

    const validation = validate(ratingSchema, { storeId, rating });
    
    if (!validation.success) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: validation.errors
        }
      });
    }

    const result = await submitRating(req.user.id, storeId, rating);

    res.status(200).json({
      message: 'Rating submitted successfully',
      rating: result
    });
  } catch (error) {
    console.error('Submit rating route error:', error);
    
    if (error.message === 'Store not found') {
      return res.status(404).json({
        error: {
          message: error.message,
          code: 'STORE_NOT_FOUND'
        }
      });
    }

    res.status(500).json({
      error: {
        message: 'Failed to submit rating',
        code: 'SUBMIT_RATING_ERROR'
      }
    });
  }
});

// Get user's rating for store - USER only
router.get('/:id/rating', authenticateToken, authorize('USER'), async (req, res) => {
  try {
    const { id: storeId } = req.params;

    const rating = await getUserRatingForStore(req.user.id, storeId);

    if (!rating) {
      return res.status(404).json({
        error: {
          message: 'No rating found for this store',
          code: 'RATING_NOT_FOUND'
        }
      });
    }

    res.status(200).json({ rating });
  } catch (error) {
    console.error('Get user rating route error:', error);
    
    res.status(500).json({
      error: {
        message: 'Failed to fetch rating',
        code: 'GET_RATING_ERROR'
      }
    });
  }
});

export default router;
