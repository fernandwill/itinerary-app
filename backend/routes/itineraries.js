const express = require('express');
const router = express.Router();

// Placeholder routes - will be implemented in later tasks

// GET /api/itineraries
router.get('/', (req, res) => {
  res.json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Get itineraries endpoint not yet implemented'
    }
  });
});

// POST /api/itineraries
router.post('/', (req, res) => {
  res.json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Create itinerary endpoint not yet implemented'
    }
  });
});

// GET /api/itineraries/:id
router.get('/:id', (req, res) => {
  res.json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Get itinerary endpoint not yet implemented'
    }
  });
});

// PUT /api/itineraries/:id
router.put('/:id', (req, res) => {
  res.json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Update itinerary endpoint not yet implemented'
    }
  });
});

// DELETE /api/itineraries/:id
router.delete('/:id', (req, res) => {
  res.json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Delete itinerary endpoint not yet implemented'
    }
  });
});

module.exports = router;