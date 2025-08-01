const express = require('express');
const router = express.Router();

// Placeholder routes - will be implemented in later tasks

// GET /api/places/search
router.get('/search', (req, res) => {
  res.json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Places search endpoint not yet implemented'
    }
  });
});

// GET /api/places/directions
router.get('/directions', (req, res) => {
  res.json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Directions endpoint not yet implemented'
    }
  });
});

module.exports = router;