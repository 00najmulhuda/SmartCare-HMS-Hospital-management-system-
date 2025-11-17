// routes/feedbackRoutes.js
const express = require('express');
const router = express.Router();
const { submitFeedback, getAllFeedback } = require('../controllers/feedbackController');

// POST /api/feedback (public)
router.post('/', submitFeedback);

// GET /api/feedback (admin/front-end can call to list)
router.get('/', getAllFeedback);

module.exports = router;
