import Notification from '../models/Notification.js';
import AppError from '../middleware/errorHandler.js';
import nodemailer from 'nodemailer';

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Create Notification
export const createNotification = async (req, res, next) => {
  try {
    const { userId, type, title, message, data, channels } = req.body;

    if (!userId || !type || !title || !message) {
      throw new AppError('Required fields missing', 400);
    }

    const notification = new Notification({
      user: userId,
      type,
      title,
      message,
      data,
      channels: channels || ['inApp']
    });

    await notification.save();

    // Send via channels
    if (channels?.includes('email')) {
      // Send email notification
      sendEmailNotification(userId, title, message);
    }

    if (channels?.includes('sms')) {
      // Send SMS notification
      sendSMSNotification(userId, message);
    }

    res.status(201).json({
      success: true,
      message: 'Notification created',
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

// Get User Notifications
export const getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, type, read } = req.query;

    const query = { user: req.user._id };
    if (type) query.type = type;
    if (read !== undefined) query.isRead = read === 'true';

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      isRead: false
    });

    res.json({
      success: true,
      data: notifications,
      unreadCount,
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

// Get Unread Count
export const getUnreadCount = async (req, res, next) => {
  try {
    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      isRead: false
    });

    res.json({
      success: true,
      data: { unreadCount }
    });
  } catch (error) {
    next(error);
  }
};

// Mark as Read
export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);

    if (!notification) {
      throw new AppError('Notification not found', 404);
    }

    if (notification.user.toString() !== req.user._id.toString()) {
      throw new AppError('Not authorized', 403);
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    res.json({
      success: true,
      message: 'Marked as read',
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

// Mark All as Read
export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    next(error);
  }
};

// Delete Notification
export const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);

    if (!notification) {
      throw new AppError('Notification not found', 404);
    }

    if (notification.user.toString() !== req.user._id.toString()) {
      throw new AppError('Not authorized', 403);
    }

    await Notification.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    next(error);
  }
};

// Clear All Notifications
export const clearAllNotifications = async (req, res, next) => {
  try {
    await Notification.deleteMany({ user: req.user._id });

    res.json({
      success: true,
      message: 'All notifications cleared'
    });
  } catch (error) {
    next(error);
  }
};

// Get Notification by ID
export const getNotificationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);

    if (!notification) {
      throw new AppError('Notification not found', 404);
    }

    if (notification.user.toString() !== req.user._id.toString()) {
      throw new AppError('Not authorized', 403);
    }

    if (!notification.isRead) {
      notification.isRead = true;
      notification.readAt = new Date();
      await notification.save();
    }

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

// Send Bulk Notifications
export const sendBulkNotifications = async (req, res, next) => {
  try {
    const { userIds, type, title, message, data } = req.body;

    if (!userIds || !type || !title || !message) {
      throw new AppError('Required fields missing', 400);
    }

    const notifications = await Notification.insertMany(
      userIds.map(userId => ({
        user: userId,
        type,
        title,
        message,
        data,
        channels: ['inApp']
      }))
    );

    res.status(201).json({
      success: true,
      message: `${notifications.length} notifications sent`,
      data: notifications
    });
  } catch (error) {
    next(error);
  }
};

// Subscribe to Push Notifications
export const subscribeToPushNotifications = async (req, res, next) => {
  try {
    const { subscription } = req.body;

    if (!subscription) {
      throw new AppError('Subscription data required', 400);
    }

    // Store subscription in database (implementation depends on web push service)
    // This would typically be stored in a PushSubscription model

    res.json({
      success: true,
      message: 'Subscribed to push notifications'
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to send email notification
const sendEmailNotification = async (userId, title, message) => {
  try {
    // In production, fetch user email from database
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'user@example.com',
      subject: title,
      html: `<p>${message}</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email notification failed:', error);
      } else {
        console.log('Email notification sent:', info.response);
      }
    });
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
};

// Helper function to send SMS notification
const sendSMSNotification = async (userId, message) => {
  try {
    // Integration with SMS service like Twilio
    // Example: const twilioClient = require('twilio')(accountSid, authToken);
    // Implementation depends on chosen SMS provider
    console.log('SMS notification:', message);
  } catch (error) {
    console.error('Error sending SMS notification:', error);
  }
};
