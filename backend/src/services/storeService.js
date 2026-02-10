import { query } from '../db/pool.js';

export const createStore = async (storeData) => {
  const { name, email, address, ownerUserId } = storeData;

  try {
    // check if owner exists and has OWNER role
    const ownerResult = await query(
      'SELECT id, role FROM users WHERE id = $1',
      [ownerUserId]
    );

    if (ownerResult.rows.length === 0) {
      throw new Error('Owner user not found');
    }

    if (ownerResult.rows[0].role !== 'OWNER') {
      throw new Error('User must have OWNER role');
    }

    // check email uniqueness
    const existingStore = await query(
      'SELECT id FROM stores WHERE email = $1',
      [email]
    );

    if (existingStore.rows.length > 0) {
      throw new Error('Store email already exists');
    }

    // create store
    const result = await query(
      `INSERT INTO stores (name, email, address, owner_user_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, address, owner_user_id, created_at`,
      [name, email, address, ownerUserId]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Create store error:', error);
    throw error;
  }
};

// Get stores with search and pagination
export const getStores = async (options = {}) => {
  const {
    search,
    sortBy = 'created_at',
    sortOrder = 'desc',
    page = 1,
    limit = 10
  } = options;

  try {
    const conditions = [];
    const params = [];
    let paramCount = 1;

    if (search) {
      conditions.push(`(s.name ILIKE $${paramCount} OR s.address ILIKE $${paramCount})`);
      params.push(`%${search}%`);
      paramCount++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // prevent SQL injection
    const allowedSortFields = ['name', 'email', 'address', 'created_at'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? `s.${sortBy}` : 's.created_at';
    const safeSortOrder = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    // count total
    const countResult = await query(
      `SELECT COUNT(*) FROM stores s ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    const offset = (page - 1) * limit;
    const totalPages = Math.ceil(total / limit);

    // get stores with ratings
    const result = await query(
      `SELECT 
        s.id, s.name, s.email, s.address, s.owner_user_id, s.created_at, s.updated_at,
        u.name as owner_name,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as total_ratings
       FROM stores s
       LEFT JOIN users u ON s.owner_user_id = u.id
       LEFT JOIN ratings r ON s.id = r.store_id
       ${whereClause}
       GROUP BY s.id, u.name
       ORDER BY ${safeSortBy} ${safeSortOrder}
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      [...params, limit, offset]
    );

    return {
      stores: result.rows.map(store => ({
        ...store,
        average_rating: parseFloat(store.average_rating).toFixed(2),
        total_ratings: parseInt(store.total_ratings)
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages
      }
    };
  } catch (error) {
    console.error('Get stores error:', error);
    throw error;
  }
};

export const getStoreWithRating = async (storeId) => {
  try {
    const result = await query(
      `SELECT 
        s.id, s.name, s.email, s.address, s.owner_user_id, s.created_at, s.updated_at,
        u.name as owner_name,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as total_ratings
       FROM stores s
       LEFT JOIN users u ON s.owner_user_id = u.id
       LEFT JOIN ratings r ON s.id = r.store_id
       WHERE s.id = $1
       GROUP BY s.id, u.name`,
      [storeId]
    );

    if (result.rows.length === 0) {
      throw new Error('Store not found');
    }

    const store = result.rows[0];
    return {
      ...store,
      average_rating: parseFloat(store.average_rating).toFixed(2),
      total_ratings: parseInt(store.total_ratings)
    };
  } catch (error) {
    console.error('Get store with rating error:', error);
    throw error;
  }
};
