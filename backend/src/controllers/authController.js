import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import supabase from '../config/supabase.js';
import { sendSuccess, sendError } from '../utils/response.js';

// ── Validation schemas ──────────────────────────────────────────────

export const signupSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be at most 100 characters'),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
});

// ── Helpers ─────────────────────────────────────────────────────────

function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function sanitizeUser(user) {
  const { password, ...safe } = user;
  return safe;
}

// ── Controllers ─────────────────────────────────────────────────────

/**
 * POST /api/auth/signup
 */
export async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const { data: existingUser, error: lookupError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return sendError(res, 'Email is already registered.', 409);
    }

    // lookupError is expected (PGRST116 = no rows) when user doesn't exist
    if (lookupError && lookupError.code !== 'PGRST116') {
      throw lookupError;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({ name, email, password: hashedPassword })
      .select()
      .single();

    if (insertError) throw insertError;

    const token = generateToken(newUser.id);

    return sendSuccess(
      res,
      { user: sanitizeUser(newUser), token },
      'User registered successfully.',
      201
    );
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Find user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return sendError(res, 'Invalid email or password.', 401);
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password.', 401);
    }

    const token = generateToken(user.id);

    return sendSuccess(res, { user: sanitizeUser(user), token }, 'Login successful.');
  } catch (err) {
    next(err);
  }
}
