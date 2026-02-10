import { query } from '../db/pool.js';

// Submit or update rating (upsert)
export const submitRating = async (userId, storeId, ratingValue) => {
  try {
    // verify store exists
    const storeCheck = await query(
      'SELECT id FROM stores WHERE id = $1',
      [storeId]
    );

    if (storeCheck.rows.length === 0) {
      throw new Error('Store not found');
    }

    // upsert rating using ON CONFLICT - this will either insert or update
    const result = await query(
      `INSERT INTO ratings (user_id, store_id, rating)
       VALUES ($1, $2, $3)
       ON CONFLICT (store_id, user_id)
       DO UPDATE SET rating = $3, updated_at = NOW()
       RETURNING id, user_id, store_id, rating, created_at, updated_at`,
      [userId, storeId, ratingValue]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Submit rating error:', error);
    throw error;
  }
};

export const getUserRatingForStore = async (userId, storeId) => {
  try {
    const result = await query(
      `SELECT id, user_id, store_id, rating, created_at, updated_at
       FROM ratings
       WHERE user_id = $1 AND store_id = $2`,
      [userId, storeId]
    );

    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Get user rating error:', error);
    throw error;
  }
};

// Get all ratings for a store
export const getRatingsByStore = async (storeId) => {
  try {
    // check store exists
    const storeCheck = await query(
      'SELECT id FROM stores WHERE id = $1',
      [storeId]
    );

    if (storeCheck.rows.length === 0) {
      throw new Error('Store not found');
    }

    // get ratings with user info
    const result = await query(
      `SELECT 
        r.id, r.rating, r.created_at, r.updated_at,
        u.id as user_id, u.name as user_name, u.email as user_email
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = $1
       ORDER BY r.created_at DESC`,
      [storeId]
    );

    // calculate average
    const avgResult = await query(
      `SELECT COALESCE(AVG(rating), 0) as average, COUNT(*) as total
       FROM ratings
       WHERE store_id = $1`,
      [storeId]
    );

    return {
      ratings: result.rows,
      average: parseFloat(avgResult.rows[0].average).toFixed(2),
      total: parseInt(avgResult.rows[0].total)
    };
  } catch (error) {
    console.error('Get ratings by store error:', error);
    throw error;
  }
};
