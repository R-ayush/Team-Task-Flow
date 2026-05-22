import jwt from 'jsonwebtoken';
import supabase from '../config/supabase.js';
import { sendError } from '../utils/response.js';

/**
 * Authentication middleware.
 * Extracts Bearer token, verifies JWT, fetches user from DB, attaches to req.user.
 */
export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Access denied. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return sendError(res, 'Invalid or expired token.', 401);
    }

    // Fetch user from database to confirm they still exist
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, role')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      return sendError(res, 'User not found. Token may be invalid.', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}
