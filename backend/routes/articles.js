const express = require('express');
const { body, validationResult } = require('express-validator');
const Article = require('../models/Article');
const { authenticateToken, checkRole, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Utility: send consistent error responses
const handleErrors = (res, error, status = 500) => {
  res.status(status).json({ success: false, message: error.message || 'Internal server error' });
};

// @route GET /api/articles
// @desc Get all articles with optional filtering
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, search, isPremium, page = 1, limit = 10 } = req.query;
    const query = {};

    if (category) query.category = category;
    if (isPremium !== undefined) query.isPremium = isPremium === 'true';
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } }
      ];
    }

    // Premium access check
    if (query.isPremium && (!req.user || req.user.subscription?.type === 'free')) {
      delete query.isPremium;
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const articles = await Article.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    const total = await Article.countDocuments(query);

    res.json({
      success: true,
      articles,
      pagination: {
        total,
        page: parseInt(page, 10),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    handleErrors(res, error);
  }
});

// @route GET /api/articles/breaking
router.get('/breaking', async (req, res) => {
  try {
    const articles = await Article.find({ isBreakingNews: true })
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({ success: true, articles });
  } catch (error) {
    handleErrors(res, error);
  }
});

// @route GET /api/articles/:id
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name email');

    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });

    if (article.isPremium && (!req.user || req.user.subscription?.type === 'free')) {
      return res.status(403).json({
        success: false,
        message: 'Premium content requires subscription',
        preview: article.summary
      });
    }

    res.json({ success: true, article });
  } catch (error) {
    handleErrors(res, error);
  }
});

// @route POST /api/articles
// @desc Create new article (Editor/Admin only)
router.post(
  '/',
  authenticateToken,
  checkRole('editor', 'admin'),
  [
    body('title').trim().isLength({ min: 5 }),
    body('summary').trim().isLength({ min: 10 }),
    body('content').trim().isLength({ min: 20 }),
    body('category').isIn(['world', 'politics', 'sports', 'entertainment', 'technology', 'business']),
    body('isPremium').optional().isBoolean(),
    body('isBreakingNews').optional().isBoolean()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { title, summary, content, imageUrl, category, isPremium, isBreakingNews } = req.body;
      const article = new Article({
        title,
        summary,
        content,
        imageUrl,
        category,
        author: req.user.id,
        isPremium: !!isPremium,
        isBreakingNews: !!isBreakingNews
      });

      await article.save();
      await article.populate('author', 'name email');

      res.status(201).json({ success: true, message: 'Article created successfully', article });
    } catch (error) {
      handleErrors(res, error);
    }
  }
);

// @route PUT /api/articles/:id
// @desc Update article (Author/Admin only)
router.put(
  '/:id',
  authenticateToken,
  [
    body('title').optional().trim().isLength({ min: 5 }),
    body('summary').optional().trim().isLength({ min: 10 }),
    body('content').optional().trim().isLength({ min: 20 }),
    body('category').optional().isIn(['world', 'politics', 'sports', 'entertainment', 'technology', 'business']),
    body('isPremium').optional().isBoolean(),
    body('isBreakingNews').optional().isBoolean()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    try {
      let article = await Article.findById(req.params.id);
      if (!article) return res.status(404).json({ success: false, message: 'Article not found' });

      if (article.author.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Not authorized to update this article' });
      }

      Object.assign(article, req.body, { updatedAt: new Date() });
      await article.save();

      res.json({ success: true, message: 'Article updated successfully', article });
    } catch (error) {
      handleErrors(res, error);
    }
  }
);

// @route DELETE /api/articles/:id
// @desc Delete article (Author/Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });

    if (article.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this article' });
    }

    await Article.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    handleErrors(res, error);
  }
});

module.exports = router;
