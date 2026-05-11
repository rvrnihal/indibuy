import express from 'express';
import { register, login, logout, refreshToken, getProfile, updateProfile } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', authenticate, logout);
router.post('/refresh', refreshToken);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

export default router;
