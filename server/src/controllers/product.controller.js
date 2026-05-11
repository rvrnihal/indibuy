import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Review from '../models/Review.js';
import Wishlist from '../models/Wishlist.js';
import { AppError } from '../middleware/errorHandler.js';

// Get all products with advanced filtering
export const getProducts = async (req, res, next) => {
  try {
    const { 
      category, 
      minPrice, 
      maxPrice, 
      search, 
      sort, 
      page = 1, 
      limit = 20,
      brand,
      rating,
      inStock,
      vendor
    } = req.query;
    
    let filter = { status: 'active', isDeleted: false };
    
    if (category) filter.category = category;
    if (vendor) filter.vendor = vendor;
    if (brand) filter.brand = brand;
    
    if (minPrice || maxPrice) {
      filter.finalPrice = {};
      if (minPrice) filter.finalPrice.$gte = parseFloat(minPrice);
      if (maxPrice) filter.finalPrice.$lte = parseFloat(maxPrice);
    }
    
    if (rating) {
      filter['ratings.average'] = { $gte: parseFloat(rating) };
    }
    
    if (inStock === 'true') {
      filter.quantity = { $gt: 0 };
    }
    
    if (search) {
      filter.$text = { $search: search };
    }
    
    const sortObj = {};
    switch(sort) {
      case 'newest': sortObj.createdAt = -1; break;
      case 'price-asc': sortObj.finalPrice = 1; break;
      case 'price-desc': sortObj.finalPrice = -1; break;
      case 'rating': sortObj['ratings.average'] = -1; break;
      case 'popular': sortObj.viewCount = -1; break;
      default: sortObj.createdAt = -1;
    }
    
    const skip = (page - 1) * limit;
    
    const products = await Product.find(filter)
      .populate('vendor', 'name companyName profileImage')
      .populate('category', 'name')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Product.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      message: 'Products retrieved',
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get product details
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('vendor', 'name companyName profileImage statistics.rating')
      .populate({
        path: 'reviews',
        populate: { path: 'reviewer', select: 'name profileImage' }
      });
    
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    
    // Increment view count
    product.viewCount = (product.viewCount || 0) + 1;
    await product.save();
    
    // Get related products
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      status: 'active'
    }).limit(5);
    
    res.status(200).json({
      success: true,
      message: 'Product details retrieved',
      data: {
        product,
        relatedProducts
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create product (vendor only)
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, category, price, costPrice, images, specifications } = req.body;
    
    if (!name || !category || !price) {
      throw new AppError('Required fields missing', 400);
    }
    
    const product = await Product.create({
      ...req.body,
      vendor: req.user.id,
      status: 'pending_approval'
    });
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Update product
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    
    if (product.vendor.toString() !== req.user.id && req.user.role !== 'admin') {
      throw new AppError('Not authorized to update this product', 403);
    }
    
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Product updated',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// Delete product
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    
    if (product.vendor.toString() !== req.user.id && req.user.role !== 'admin') {
      throw new AppError('Not authorized to delete this product', 403);
    }
    
    await Product.findByIdAndUpdate(req.params.id, { isDeleted: true });
    
    res.status(200).json({
      success: true,
      message: 'Product deleted'
    });
  } catch (error) {
    next(error);
  }
};

// Search products
export const searchProducts = async (req, res, next) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q) {
      throw new AppError('Search query is required', 400);
    }
    
    const products = await Product.find(
      { $text: { $search: q }, status: 'active' },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .limit(parseInt(limit))
    .select('name price finalPrice images category brand');
    
    res.status(200).json({
      success: true,
      message: 'Search results',
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// Get trending products
export const getTrendingProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ status: 'active' })
      .sort({ viewCount: -1, 'ratings.average': -1 })
      .limit(20);
    
    res.status(200).json({
      success: true,
      message: 'Trending products',
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// Get products by category
export const getProductsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const skip = (page - 1) * limit;
    
    const products = await Product.find({
      category: categoryId,
      status: 'active'
    })
    .skip(skip)
    .limit(parseInt(limit));
    
    const total = await Product.countDocuments({
      category: categoryId,
      status: 'active'
    });
    
    res.status(200).json({
      success: true,
      message: 'Products by category',
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Compare products
export const compareProducts = async (req, res, next) => {
  try {
    const { productIds } = req.body;
    
    if (!productIds || productIds.length < 2) {
      throw new AppError('At least 2 products required for comparison', 400);
    }
    
    const products = await Product.find({ _id: { $in: productIds } });
    
    res.status(200).json({
      success: true,
      message: 'Product comparison',
      data: products
    });
  } catch (error) {
    next(error);
  }
};
