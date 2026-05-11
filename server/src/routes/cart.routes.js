import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, (req, res) => res.json({ success: true, message: 'Get cart' }));
router.post('/add', authenticate, (req, res) => res.json({ success: true, message: 'Add to cart' }));
router.put('/update', authenticate, (req, res) => res.json({ success: true, message: 'Update cart' }));
router.delete('/:id', authenticate, (req, res) => res.json({ success: true, message: 'Remove from cart' }));

export default router;
