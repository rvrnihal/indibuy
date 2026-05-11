import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import AppError from '../middleware/errorHandler.js';

// Create Order
export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, billingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      throw new AppError('Order must contain at least one item', 400);
    }

    // Calculate totals
    let subtotal = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new AppError(`Product ${item.productId} not found`, 404);
      }

      if (product.quantity < item.quantity) {
        throw new AppError(`Insufficient stock for ${product.name}`, 400);
      }

      const lineTotal = product.finalPrice * item.quantity;
      subtotal += lineTotal;

      processedItems.push({
        product: product._id,
        vendor: product.vendor,
        quantity: item.quantity,
        price: product.finalPrice,
        discount: product.discount || 0,
        lineTotal
      });

      // Reduce product quantity
      product.quantity -= item.quantity;
      product.reserved += item.quantity;
      await product.save();
    }

    const tax = Math.round(subtotal * 0.18);
    const shipping = subtotal > 500 ? 0 : 100;
    const total = subtotal + tax + shipping;

    const order = new Order({
      buyer: req.user._id,
      items: processedItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      pricing: {
        subtotal,
        tax,
        gst: tax,
        shipping,
        discount: 0,
        total
      },
      payment: {
        method: paymentMethod,
        status: paymentMethod === 'cod' ? 'pending' : 'completed'
      }
    });

    await order.save();
    await order.populate('buyer items.product items.vendor');

    // Clear cart
    await Cart.deleteOne({ user: req.user._id });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// Get Orders
export const getOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { buyer: req.user._id };

    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('items.product items.vendor')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
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

// Get Order by ID
export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer items.product items.vendor shipping.deliveryPartner');

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Check authorization
    if (order.buyer.toString() !== req.user._id.toString()) {
      throw new AppError('Not authorized to view this order', 403);
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// Update Order Status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned', 'refunded'];

    if (!validStatuses.includes(status)) {
      throw new AppError('Invalid order status', 400);
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    order.status = status;
    order.timeline.push({
      status,
      timestamp: new Date(),
      actor: req.user._id
    });

    await order.save();

    res.json({
      success: true,
      message: 'Order status updated',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// Cancel Order
export const cancelOrder = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (order.buyer.toString() !== req.user._id.toString()) {
      throw new AppError('Not authorized', 403);
    }

    if (['delivered', 'cancelled', 'refunded'].includes(order.status)) {
      throw new AppError('Cannot cancel this order', 400);
    }

    order.status = 'cancelled';
    order.notes = reason || 'User cancelled order';
    order.timeline.push({
      status: 'cancelled',
      timestamp: new Date(),
      actor: req.user._id
    });

    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// Request Return
export const requestReturn = async (req, res, next) => {
  try {
    const { reason, items } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (order.buyer.toString() !== req.user._id.toString()) {
      throw new AppError('Not authorized', 403);
    }

    if (order.status !== 'delivered') {
      throw new AppError('Can only return delivered orders', 400);
    }

    order.status = 'returned';
    order.notes = reason;
    order.timeline.push({
      status: 'return_initiated',
      timestamp: new Date(),
      actor: req.user._id
    });

    await order.save();

    res.json({
      success: true,
      message: 'Return request submitted',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// Get Order Invoice
export const getOrderInvoice = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer items.product');

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (order.buyer._id.toString() !== req.user._id.toString()) {
      throw new AppError('Not authorized', 403);
    }

    // Generate simple invoice data
    const invoice = {
      orderNumber: order.orderNumber,
      date: order.createdAt,
      buyer: {
        name: order.buyer.name,
        email: order.buyer.email,
        phone: order.buyer.phone
      },
      items: order.items,
      pricing: order.pricing,
      shippingAddress: order.shippingAddress
    };

    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    next(error);
  }
};
