const express = require('express');
const router = express.Router();

// Placeholder routes - will be implemented in later tasks

// GET /api/collaborators/:itineraryId
router.get('/:itineraryId', (req, res) => {
  res.json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Get collaborators endpoint not yet implemented'
    }
  });
});

// POST /api/collaborators/:itineraryId
router.post('/:itineraryId', (req, res) => {
  res.json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Add collaborator endpoint not yet implemented'
    }
  });
});

// DELETE /api/collaborators/:itineraryId/:userId
router.delete('/:itineraryId/:userId', (req, res) => {
  res.json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Remove collaborator endpoint not yet implemented'
    }
  });
});

module.exports = router;