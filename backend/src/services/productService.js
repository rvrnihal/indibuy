import Product from '../models/Product.js';
import Category from '../models/Category.js';

// Get all products with filtering
export const getProducts = async (filters = {}) => {
  try {
    const {
      category,
      vendor,
      minPrice,
      maxPrice,
      search,
      rating,
      page = 1,
      limit = 20,
      sort = '-createdAt'
    } = filters;

    let query = { status: 'active' };

    // Category filter
    if (category) {
      query.category = category;
    }

    // Vendor filter
    if (vendor) {
      query.vendor = vendor;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query['price.original'] = { $gte: minPrice };
      if (maxPrice) query['price.original'] = { ...query['price.original'], $lte: maxPrice };
    }

    // Search filter
    if (search) {
      query.$text = { $search: search };
    }

    // Rating filter
    if (rating) {
      query['ratings.average'] = { $gte: rating };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('category', 'name')
      .populate('vendor', 'storeName')
      .lean();

    const total = await Product.countDocuments(query);

    return {
      success: true,
      data: products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    throw error;
  }
};

// Get single product
export const getProductById = async (productId) => {
  try {
    const product = await Product.findById(productId)
      .populate('category')
      .populate('vendor')
      .populate('reviews');

    if (!product) {
      throw new Error('Product not found');
    }

    // Increment views
    product.views = (product.views || 0) + 1;
    await product.save();

    return {
      success: true,
      data: product
    };
  } catch (error) {
    throw error;
  }
};

// Create product (Vendor)
export const createProduct = async (vendorId, productData) => {
  try {
    const product = new Product({
      ...productData,
      vendor: vendorId,
      status: 'draft'
    });

    await product.save();
    return {
      success: true,
      data: product
    };
  } catch (error) {
    throw error;
  }
};

// Update product (Vendor)
export const updateProduct = async (productId, vendorId, updateData) => {
  try {
    const product = await Product.findById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.vendor.toString() !== vendorId.toString()) {
      throw new Error('Not authorized to update this product');
    }

    Object.assign(product, updateData);
    await product.save();

    return {
      success: true,
      data: product
    };
  } catch (error) {
    throw error;
  }
};

// Delete product (Vendor)
export const deleteProduct = async (productId, vendorId) => {
  try {
    const product = await Product.findById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.vendor.toString() !== vendorId.toString()) {
      throw new Error('Not authorized to delete this product');
    }

    await Product.findByIdAndDelete(productId);

    return {
      success: true,
      message: 'Product deleted'
    };
  } catch (error) {
    throw error;
  }
};

// Search products
export const searchProducts = async (searchTerm, limit = 10) => {
  try {
    const products = await Product.find(
      { $text: { $search: searchTerm }, status: 'active' },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .select('name slug price.original ratings.average -_id');

    return {
      success: true,
      data: products
    };
  } catch (error) {
    throw error;
  }
};

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
};
