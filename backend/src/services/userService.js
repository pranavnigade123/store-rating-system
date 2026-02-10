import { query } from '../db/pool.js';
import { hashPassword } from '../utils/bcrypt.js';

// Create a new user - admin can set any role
export const createUser = async (userData) => {
  const { name, email, password, address, role } = userData;

  try {
    // check if email exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new Error('Email already exists');
    }

    const passwordHash = await hashPassword(password);

    // create user
    const result = await query(
      `INSERT INTO users (name, email, password_hash, address, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role, address, created_at`,
      [name, email, passwordHash, address || null, role]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
};

// Get users with filtering and pagination
export const getUsers = async (options = {}) => {
  const {
    role,
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

    // build WHERE clause dynamically
    if (role) {
      conditions.push(`role = $${paramCount}`);
      params.push(role);
      paramCount++;
    }

    if (search) {
      conditions.push(`(name ILIKE $${paramCount} OR email ILIKE $${paramCount})`);
      params.push(`%${search}%`);
      paramCount++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // validate sort field to prevent SQL injection
    const allowedSortFields = ['name', 'email', 'role', 'created_at'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    // get total count first
    const countResult = await query(
      `SELECT COUNT(*) FROM users ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    const offset = (page - 1) * limit;
    const totalPages = Math.ceil(total / limit);

    // fetch users
    const result = await query(
      `SELECT id, name, email, role, address, created_at, updated_at
       FROM users
       ${whereClause}
       ORDER BY ${safeSortBy} ${safeSortOrder}
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      [...params, limit, offset]
    );

    return {
      users: result.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages
      }
    };
  } catch (error) {
    console.error('Get users error:', error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const result = await query(
      `SELECT id, name, email, role, address, created_at, updated_at
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Get user by ID error:', error);
    throw error;
  }
};
