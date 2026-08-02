const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticateToken, checkRole } = require('../middleware/auth');

const router = express.Router();

// Utility: consistent error responses
const handleError = (res, error, status = 500) => {
  res.status(status).json({ success: false, message: error.message || 'Internal server error' });
};

// @route GET /api/users (Admin only)
// @desc Get all users with filters + pagination
router.get('/', authenticateToken, checkRole('admin'), async (req, res) => {
  try {
    const { role, page = 1, limit = 10, search } = req.query;
    const query = {};

    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        total,
        page: parseInt(page, 10),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    handleError(res, error);
  }
});

// @route GET /api/users/:id (Admin only)
router.get('/:id', authenticateToken, checkRole('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    handleError(res, error);
  }
});

// @route PUT /api/users/:id (Admin only)
// @desc Update user details
router.put(
  '/:id',
  authenticateToken,
  checkRole('admin'),
  [
    body('name').optional().trim().isLength({ min: 2 }),
    body('email').optional().isEmail(),
    body('role').optional().isIn(['guest', 'subscriber', 'editor', 'admin'])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { name, email, role } = req.body;
      let user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      if (name) user.name = name;
      if (email) {
        const existingUser = await User.findOne({ email, _id: { $ne: req.params.id } });
        if (existingUser) return res.status(400).json({ success: false, message: 'Email already in use' });
        user.email = email;
      }
      if (role) user.role = role;

      user.updatedAt = new Date();
      await user.save();

      res.json({ success: true, message: 'User updated successfully', user: user.toJSON() });
    } catch (error) {
      handleError(res, error);
    }
  }
);

// @route DELETE /api/users/:id (Admin only)
router.delete('/:id', authenticateToken, checkRole('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ success: false, message: 'Cannot delete the last admin' });
      }
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    handleError(res, error);
  }
});

// @route POST /api/users/:id/assign-role (Admin only)
router.post(
  '/:id/assign-role',
  authenticateToken,
  checkRole('admin'),
  [body('role').isIn(['guest', 'subscriber', 'editor', 'admin'])],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { role } = req.body;
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role, updatedAt: new Date() },
        { new: true }
      ).select('-password');

      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      res.json({ success: true, message: `User role updated to ${role}`, user });
    } catch (error) {
      handleError(res, error);
    }
  }
);

// @route GET /api/users/stats/dashboard (Admin only)
router.get('/stats/dashboard', authenticateToken, checkRole('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const byRole = {
      guests: await User.countDocuments({ role: 'guest' }),
      subscribers: await User.countDocuments({ role: 'subscriber' }),
      editors: await User.countDocuments({ role: 'editor' }),
      admins: await User.countDocuments({ role: 'admin' })
    };

    res.json({ success: true, totalUsers, byRole });
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;
