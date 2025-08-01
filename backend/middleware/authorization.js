const { Itinerary, Collaborator } = require('../models');

// Check if user owns the itinerary
const checkItineraryOwnership = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const itinerary = await Itinerary.findByPk(id);
    
    if (!itinerary) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ITINERARY_NOT_FOUND',
          message: 'Itinerary not found'
        }
      });
    }

    if (itinerary.ownerId !== userId) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: 'You do not have permission to access this itinerary'
        }
      });
    }

    req.itinerary = itinerary;
    next();
  } catch (error) {
    console.error('Authorization error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'AUTHORIZATION_ERROR',
        message: 'Failed to check permissions'
      }
    });
  }
};

// Check if user can view the itinerary (owner or collaborator)
const checkItineraryAccess = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const itinerary = await Itinerary.findByPk(id, {
      include: [
        {
          model: Collaborator,
          as: 'collaboratorRecords',
          where: { userId },
          required: false
        }
      ]
    });
    
    if (!itinerary) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ITINERARY_NOT_FOUND',
          message: 'Itinerary not found'
        }
      });
    }

    // Check if user is owner or collaborator
    const isOwner = itinerary.ownerId === userId;
    const isCollaborator = itinerary.collaboratorRecords && itinerary.collaboratorRecords.length > 0;
    const isPublic = itinerary.isPublic;

    if (!isOwner && !isCollaborator && !isPublic) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: 'You do not have permission to access this itinerary'
        }
      });
    }

    req.itinerary = itinerary;
    req.userRole = isOwner ? 'owner' : (isCollaborator ? 'collaborator' : 'public');
    next();
  } catch (error) {
    console.error('Authorization error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'AUTHORIZATION_ERROR',
        message: 'Failed to check permissions'
      }
    });
  }
};

// Check if user can edit the itinerary (owner or editor/admin collaborator)
const checkItineraryEditAccess = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const itinerary = await Itinerary.findByPk(id, {
      include: [
        {
          model: Collaborator,
          as: 'collaboratorRecords',
          where: { userId },
          required: false
        }
      ]
    });
    
    if (!itinerary) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ITINERARY_NOT_FOUND',
          message: 'Itinerary not found'
        }
      });
    }

    // Check if user is owner
    const isOwner = itinerary.ownerId === userId;
    
    // Check if user is collaborator with edit permissions
    const collaborator = itinerary.collaboratorRecords && itinerary.collaboratorRecords[0];
    const canEdit = collaborator && (collaborator.role === 'editor' || collaborator.role === 'admin');

    if (!isOwner && !canEdit) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'EDIT_ACCESS_DENIED',
          message: 'You do not have permission to edit this itinerary'
        }
      });
    }

    req.itinerary = itinerary;
    req.userRole = isOwner ? 'owner' : collaborator.role;
    next();
  } catch (error) {
    console.error('Authorization error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'AUTHORIZATION_ERROR',
        message: 'Failed to check permissions'
      }
    });
  }
};

module.exports = {
  checkItineraryOwnership,
  checkItineraryAccess,
  checkItineraryEditAccess
};