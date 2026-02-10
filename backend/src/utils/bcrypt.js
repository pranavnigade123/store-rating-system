import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const hashPassword = async (password) => {
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    return hash;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
};

export const comparePassword = async (password, hash) => {
  try {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw new Error('Failed to compare passwords');
  }
};
