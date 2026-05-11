import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import * as notificationController from '../controllers/notification.controller.js';

const router = express.Router();

router.use(authenticate);

// User notifications
router.get('/', notificationController.getNotifications);
router.get('/unread/count', notificationController.getUnreadCount);
router.get('/:id', notificationController.getNotificationById);

// Mark as read
router.put('/:id/read', notificationController.markAsRead);
router.put('/read/all', notificationController.markAllAsRead);

// Delete
router.delete('/:id', notificationController.deleteNotification);
router.delete('/clear/all', notificationController.clearAllNotifications);

// Push notifications
router.post('/subscribe', notificationController.subscribeToPushNotifications);

// Admin - send bulk notifications
router.post('/admin/bulk', authorize(['admin']), notificationController.sendBulkNotifications);

// Admin - create notification
router.post('/admin/create', authorize(['admin']), notificationController.createNotification);

export default router;
