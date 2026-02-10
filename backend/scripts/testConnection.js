import dotenv from 'dotenv';
import pool from '../src/db/pool.js';

dotenv.config();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const result = await pool.query('SELECT NOW()');
    console.log('✓ Connected successfully');
    console.log('Server time:', result.rows[0].now);
    process.exit(0);
  } catch (error) {
    console.error('✗ Connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
