const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const { authenticateToken, checkRole } = require('../middleware/auth');

const router = express.Router();

const PLANS = {
  free: { price: 0, durationDays: null },
  monthly: { price: 9.99, durationDays: 30 },
  yearly: { price: 99.99, durationDays: 365 }
};

// @route GET /api/subscriptions/plans
// @desc Get all subscription plans
router.get('/plans', (req, res) => {
  res.json(PLANS);
});

// @route GET /api/subscriptions/my-subscription
// @desc Get current user's subscription
router.get('/my-subscription', authenticateToken, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user.id });

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route POST /api/subscriptions/upgrade
// @desc Upgrade or downgrade subscription
router.post(
  '/upgrade',
  authenticateToken,
  [
    body('planType').isIn(['free', 'monthly', 'yearly']).withMessage('Invalid plan type')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { planType } = req.body;
      const plan = PLANS[planType];

      // Find or create subscription
      let subscription = await Subscription.findOne({ userId: req.user.id });

      if (!subscription) {
        subscription = new Subscription({
          userId: req.user.id,
          planType,
          status: 'active',
          price: plan.price,
          startDate: new Date()
        });
      } else {
        subscription.planType = planType;
        subscription.status = 'active';
        subscription.price = plan.price;
        subscription.startDate = new Date();
      }

      // Calculate end date
      if (plan.durationDays) {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + plan.durationDays);
        subscription.endDate = endDate;
      } else {
        subscription.endDate = null;
      }

      await subscription.save();

      // Update user subscription info
      const user = await User.findById(req.user.id);
      user.subscription = {
        type: planType,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        isActive: true
      };
      await user.save();

      res.json({
        message: `Successfully upgraded to ${planType} plan`,
        subscription
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// @route POST /api/subscriptions/cancel
// @desc Cancel subscription
router.post('/cancel', authenticateToken, async (req, res) => {
  try {
    let subscription = await Subscription.findOne({ userId: req.user.id });

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    subscription.status = 'cancelled';
    subscription.autoRenewal = false;
    await subscription.save();

    // Update user
    const user = await User.findById(req.user.id);
    user.subscription = {
      type: 'free',
      startDate: new Date(),
      endDate: null,
      isActive: false
    };
    await user.save();

    res.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route GET /api/subscriptions (Admin only)
// @desc Get all subscriptions
router.get('/', authenticateToken, checkRole('admin'), async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route GET /api/subscriptions/user/:userId (Admin only)
// @desc Get user's subscription
router.get('/user/:userId', authenticateToken, checkRole('admin'), async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.params.userId })
      .populate('userId', 'name email');

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route PUT /api/subscriptions/:subscriptionId (Admin only)
// @desc Update subscription
router.put(
  '/:subscriptionId',
  authenticateToken,
  checkRole('admin'),
  [
    body('planType').optional().isIn(['free', 'monthly', 'yearly']),
    body('status').optional().isIn(['active', 'inactive', 'cancelled', 'expired']),
    body('autoRenewal').optional().isBoolean()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const subscription = await Subscription.findByIdAndUpdate(
        req.params.subscriptionId,
        { ...req.body, updatedAt: new Date() },
        { new: true }
      ).populate('userId', 'name email');

      if (!subscription) {
        return res.status(404).json({ error: 'Subscription not found' });
      }

      res.json({
        message: 'Subscription updated successfully',
        subscription
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
