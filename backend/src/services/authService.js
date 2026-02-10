import { query } from '../db/pool.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import { generateToken } from '../utils/jwt.js';

/**
 * Sign up a new user with USER role
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User's full name (20-60 chars)
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password (8-16 chars, 1 uppercase, 1 special)
 * @param {string} [userData.address] - User's address (optional, max 400 chars)
 * @returns {Promise<Object>} Created user object (without password)
 */
export const signup = async (userData) => {
  const { name, email, password, address } = userData;

  try {
    // Check if email already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new Error('Email already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Insert new user with USER role
    const result = await query(
      `INSERT INTO users (name, email, password_hash, address, role)
       VALUES ($1, $2, $3, $4, 'USER')
       RETURNING id, name, email, role, address, created_at`,
      [name, email, passwordHash, address || null]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

/**
 * Login user and generate JWT token
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} Object with token and user info
 */
export const login = async (email, password) => {
  try {
    // Find user by email
    const result = await query(
      'SELECT id, name, email, password_hash, role FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      throw new Error('Invalid email or password');
    }

    const user = result.rows[0];

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    // Return token and user info (without password hash)
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Change user's password
 * @param {string} userId - User's ID
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Success message
 */
export const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    // Get user's current password hash
    const result = await query(
      'SELECT password_hash FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    const user = result.rows[0];

    // Verify current password
    const isPasswordValid = await comparePassword(currentPassword, user.password_hash);

    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    await query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [newPasswordHash, userId]
    );

    return { success: true, message: 'Password changed successfully' };
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
};
