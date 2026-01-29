import jwt from 'jsonwebtoken';

/**
 * Generate JWT token
 */
export function generateToken(payload) {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    }
  );
}

/**
 * Verify JWT token
 */
export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
