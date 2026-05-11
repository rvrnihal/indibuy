import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import AppError from '../middleware/errorHandler.js';

// Get Cart
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product');

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
      await cart.save();
    }

    // Calculate totals
    let totalItems = 0;
    let totalPrice = 0;

    cart.items.forEach(item => {
      totalItems += item.quantity;
      totalPrice += item.product.finalPrice * item.quantity;
    });

    const cartData = {
      ...cart.toObject(),
      summary: {
        totalItems,
        totalPrice,
        tax: Math.round(totalPrice * 0.18),
        shipping: totalPrice > 500 ? 0 : 100,
        total: totalPrice + Math.round(totalPrice * 0.18) + (totalPrice > 500 ? 0 : 100)
      }
    };

    res.json({
      success: true,
      data: cartData
    });
  } catch (error) {
    next(error);
  }
};

// Add to Cart
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (quantity < 1) {
      throw new AppError('Quantity must be at least 1', 400);
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    if (product.quantity < quantity) {
      throw new AppError('Insufficient stock', 400);
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [{ product: productId, quantity }]
      });
    } else {
      const existingItem = cart.items.find(
        item => item.product.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    cart.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await cart.save();
    await cart.populate('items.product');

    res.json({
      success: true,
      message: 'Item added to cart',
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

// Update Cart Item
export const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      throw new AppError('Quantity must be at least 1', 400);
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    const item = cart.items.find(
      item => item.product.toString() === productId
    );

    if (!item) {
      throw new AppError('Item not in cart', 404);
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product');

    res.json({
      success: true,
      message: 'Cart item updated',
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

// Remove from Cart
export const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate('items.product');

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

// Clear Cart
export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared',
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

// Apply Coupon
export const applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      status: 'active'
    });

    if (!coupon) {
      throw new AppError('Invalid coupon code', 400);
    }

    // Check expiry
    if (new Date() > coupon.validity.endDate) {
      throw new AppError('Coupon expired', 400);
    }

    // Check usage limits
    if (coupon.usage.currentUses >= coupon.usage.maxUses) {
      throw new AppError('Coupon usage limit exceeded', 400);
    }

    // Check per-user usage
    const userUsage = coupon.usage.usedBy.filter(
      u => u.toString() === req.user._id.toString()
    ).length;

    if (userUsage >= coupon.usage.maxUsesPerUser) {
      throw new AppError('You have reached maximum usage for this coupon', 400);
    }

    // Get cart
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      throw new AppError('Cart is empty', 400);
    }

    // Calculate discount
    let totalPrice = 0;
    cart.items.forEach(item => {
      totalPrice += item.product.finalPrice * item.quantity;
    });

    // Check minimum purchase
    if (totalPrice < coupon.conditions.minPurchase) {
      throw new AppError(
        `Minimum purchase amount is ₹${coupon.conditions.minPurchase}`,
        400
      );
    }

    let discount = 0;
    if (coupon.discount.type === 'percentage') {
      discount = Math.round((totalPrice * coupon.discount.value) / 100);
      discount = Math.min(discount, coupon.discount.maxDiscount || discount);
    } else {
      discount = coupon.discount.value;
    }

    // Update coupon usage
    coupon.usage.currentUses += 1;
    coupon.usage.usedBy.push(req.user._id);
    await coupon.save();

    res.json({
      success: true,
      message: 'Coupon applied successfully',
      data: {
        couponCode: coupon.code,
        discount,
        finalTotal: totalPrice - discount + Math.round(totalPrice * 0.18)
      }
    });
  } catch (error) {
    next(error);
  }
};
