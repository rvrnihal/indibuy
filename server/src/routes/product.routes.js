import express from 'express';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  searchProducts,
  getTrendingProducts,
  getProductsByCategory,
  compareProducts
} from '../controllers/product.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { searchLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/trending', getTrendingProducts);
router.get('/search', searchLimiter, searchProducts);
router.post('/compare', compareProducts);
router.get('/category/:categoryId', getProductsByCategory);
router.get('/:id', getProductById);
router.post('/', authenticate, authorize('vendor', 'admin'), createProduct);
router.put('/:id', authenticate, authorize('vendor', 'admin'), updateProduct);
router.delete('/:id', authenticate, authorize('vendor', 'admin'), deleteProduct);

export default router;
