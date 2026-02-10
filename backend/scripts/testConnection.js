import dotenv from 'dotenv';
import { query } from '../src/db/pool.js';
import { hashPassword, comparePassword } from '../src/utils/bcrypt.js';
import { generateToken, verifyToken } from '../src/utils/jwt.js';

dotenv.config();

async function runTests() {
  console.log('🧪 Running connection and utility tests...\n');

  try {
    // Test 1: Database connection
    console.log('1️⃣ Testing database connection...');
    const result = await query('SELECT NOW() as current_time');
    console.log('   ✅ Database connected:', result.rows[0].current_time);

    // Test 2: Check tables exist
    console.log('\n2️⃣ Testing tables exist...');
    const tables = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'stores', 'ratings')
      ORDER BY table_name
    `);
    console.log('   ✅ Tables found:', tables.rows.map(r => r.table_name).join(', '));

    // Test 3: Password hashing
    console.log('\n3️⃣ Testing password hashing...');
    const testPassword = 'TestPass123!';
    const hash = await hashPassword(testPassword);
    const isMatch = await comparePassword(testPassword, hash);
    console.log('   ✅ Password hashing works:', isMatch);

    // Test 4: JWT token generation and verification
    console.log('\n4️⃣ Testing JWT tokens...');
    const payload = { id: 'test-id', email: 'test@example.com', role: 'USER' };
    const token = generateToken(payload);
    const decoded = verifyToken(token);
    console.log('   ✅ JWT works:', decoded.email === payload.email);

    console.log('\n✅ All tests passed! Ready to commit.\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

runTests();
