import { Router } from 'express';
import { signup, login, signupSchema, loginSchema } from '../controllers/authController.js';
import { validate } from '../utils/validate.js';

const router = Router();

// POST /api/auth/signup
router.post('/signup', validate(signupSchema), signup);

// POST /api/auth/login
router.post('/login', validate(loginSchema), login);

export default router;
