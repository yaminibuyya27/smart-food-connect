import express from 'express';
import UserModel from '../models/user.js';
import InventoryModel from '../models/inventory.js';
import CartModel from '../models/cart.js';
import NotificationModel from '../models/notification.js';
import OrderModel from '../models/order.js';

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = await UserModel.findById(userId);
    if (!user || user.userType !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    req.adminUser = user;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

router.get('/dashboard/stats', isAdmin, async (req, res) => {
  try {

    const totalUsers = await UserModel.countDocuments();
    const shoppers = await UserModel.countDocuments({ userType: 'shopper' });
    const retailers = await UserModel.countDocuments({ userType: 'retailer' });
    const charities = await UserModel.countDocuments({ userType: 'charity' });

    const totalItems = await InventoryModel.countDocuments();
    const availableItems = await InventoryModel.countDocuments({ available: true });
    const shopperItems = await InventoryModel.countDocuments({ type: 'shopper' });
    const charityItems = await InventoryModel.countDocuments({ type: 'charity' });

    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const itemsExpiringSoon = await InventoryModel.countDocuments({
      expiryDate: { $lte: sevenDaysFromNow },
      available: true
    });

    const totalNotifications = await NotificationModel.countDocuments();
    const activeNotifications = await NotificationModel.countDocuments({ notified: false });

    const totalCarts = await CartModel.countDocuments();
    const cartsWithItems = await CartModel.countDocuments({
      items: { $exists: true, $not: { $size: 0 } }
    });

    const totalOrders = await OrderModel.countDocuments();
    const pendingOrders = await OrderModel.countDocuments({ status: 'pending' });
    const completedOrders = await OrderModel.countDocuments({ status: 'completed' });

    res.json({
      users: {
        total: totalUsers,
        shoppers,
        retailers,
        charities
      },
      inventory: {
        total: totalItems,
        available: availableItems,
        shopperItems,
        charityItems,
        expiringSoon: itemsExpiringSoon
      },
      notifications: {
        total: totalNotifications,
        active: activeNotifications
      },
      carts: {
        total: totalCarts,
        withItems: cartsWithItems
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        completed: completedOrders
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/inventory', isAdmin, async (req, res) => {
  try {
    const items = await InventoryModel.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/notifications', isAdmin, async (req, res) => {
  try {
    const notifications = await NotificationModel.find()
      .populate('userId', 'name email')
      .populate('itemId', 'product price')
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/orders', isAdmin, async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate('userId', 'name email userType')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/reports/:type', isAdmin, async (req, res) => {
  try {
    const { type } = req.params;
    const { startDate, endDate } = req.query;

    let report = {};

    switch (type) {
      case 'users': {
        const users = await UserModel.find({
          createdAt: {
            $gte: startDate ? new Date(startDate) : new Date('2000-01-01'),
            $lte: endDate ? new Date(endDate) : new Date()
          }
        }).select('-password');

        report = {
          type: 'User Report',
          generatedAt: new Date(),
          dateRange: { startDate, endDate },
          totalUsers: users.length,
          breakdown: {
            shoppers: users.filter(u => u.userType === 'shopper').length,
            retailers: users.filter(u => u.userType === 'retailer').length,
            charities: users.filter(u => u.userType === 'charity').length
          },
          users
        };
        break;
      }

      case 'inventory': {
        const items = await InventoryModel.find({
          createdAt: {
            $gte: startDate ? new Date(startDate) : new Date('2000-01-01'),
            $lte: endDate ? new Date(endDate) : new Date()
          }
        });

        const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        report = {
          type: 'Inventory Report',
          generatedAt: new Date(),
          dateRange: { startDate, endDate },
          totalItems: items.length,
          totalValue: totalValue.toFixed(2),
          breakdown: {
            available: items.filter(i => i.available).length,
            unavailable: items.filter(i => !i.available).length,
            shopperItems: items.filter(i => i.type === 'shopper').length,
            charityItems: items.filter(i => i.type === 'charity').length
          },
          items
        };
        break;
      }

      case 'notifications': {
        const notifications = await NotificationModel.find({
          createdAt: {
            $gte: startDate ? new Date(startDate) : new Date('2000-01-01'),
            $lte: endDate ? new Date(endDate) : new Date()
          }
        }).populate('userId', 'name email').populate('itemId', 'product');

        report = {
          type: 'Notifications Report',
          generatedAt: new Date(),
          dateRange: { startDate, endDate },
          totalNotifications: notifications.length,
          breakdown: {
            sent: notifications.filter(n => n.notified).length,
            pending: notifications.filter(n => !n.notified).length
          },
          notifications
        };
        break;
      }

      case 'orders': {
        const orders = await OrderModel.find({
          createdAt: {
            $gte: startDate ? new Date(startDate) : new Date('2000-01-01'),
            $lte: endDate ? new Date(endDate) : new Date()
          }
        }).populate('userId', 'name email userType');

        const totalOrders = orders.length;
        const totalOrderValue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

        const ordersByStatus = {
          pending: orders.filter(o => o.status === 'pending').length,
          confirmed: orders.filter(o => o.status === 'confirmed').length,
          completed: orders.filter(o => o.status === 'completed').length,
          cancelled: orders.filter(o => o.status === 'cancelled').length
        };

        report = {
          type: 'Orders Report',
          generatedAt: new Date(),
          dateRange: { startDate, endDate },
          totalOrders,
          totalOrderValue: totalOrderValue.toFixed(2),
          ordersByStatus,
          orders
        };
        break;
      }

      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
