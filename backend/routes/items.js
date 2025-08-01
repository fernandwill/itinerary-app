const express = require('express');
const router = express.Router();

// Placeholder routes - will be implemented in later tasks

// GET /api/items/:itineraryId
router.get('/:itineraryId', (req, res) => {
  res.json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Get itinerary items endpoint not yet implemented'
    }
  });
});

// POST /api/items/:itineraryId
router.post('/:itineraryId', (req, res) => {
  res.json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Create itinerary item endpoint not yet implemented'
    }
  });
});

// PUT /api/items/:itineraryId/:itemId
router.put('/:itineraryId/:itemId', (req, res) => {
  res.json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Update itinerary item endpoint not yet implemented'
    }
  });
});

// DELETE /api/items/:itineraryId/:itemId
router.delete('/:itineraryId/:itemId', (req, res) => {
  res.json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Delete itinerary item endpoint not yet implemented'
    }
  });
});

module.exports = router;