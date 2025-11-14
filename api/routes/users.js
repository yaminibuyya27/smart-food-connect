import express from 'express'
import UserModel from '../models/user.js'
import auth from '../middleware/auth.js'

const router = express.Router();

router.get('/verify', auth, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id).select('-password');
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, userType } = req.body;

    if (userType === 'admin') {
      return res.status(403).json({ message: 'Cannot register as admin' });
    }

    let user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    user = new UserModel({ name, email, password, userType });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account has been deactivated. Please contact support.' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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

router.get('/admin/users', isAdmin, async (req, res) => {
  try {
    const users = await UserModel.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/admin/users/:id', isAdmin, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/admin/users/:id', isAdmin, async (req, res) => {
  try {
    const { name, email, userType } = req.body;
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (userType && userType !== 'admin') user.userType = userType;

    await user.save();
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/admin/users/:id/toggle-status', isAdmin, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deactivating admin users
    if (user.userType === 'admin') {
      return res.status(403).json({ message: 'Cannot deactivate admin users' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/admin/users/:id', isAdmin, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting admin users
    if (user.userType === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }

    await UserModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;