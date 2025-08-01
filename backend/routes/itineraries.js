const express = require('express');
const { Op } = require('sequelize');
const { Itinerary, User, ItineraryItem, Collaborator } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const {
  validateCreateItinerary,
  validateUpdateItinerary,
  validateItineraryId,
  handleValidationErrors
} = require('../middleware/itineraryValidation');
const {
  checkItineraryOwnership,
  checkItineraryAccess,
  checkItineraryEditAccess
} = require('../middleware/authorization');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/itineraries - Get user's itineraries
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
    
    // Build where clause for search
    const whereClause = {
      [Op.or]: [
        { ownerId: userId },
        {
          '$collaboratorRecords.userId$': userId,
          '$collaboratorRecords.acceptedAt$': { [Op.not]: null }
        }
      ]
    };

    // Add search functionality
    if (search) {
      whereClause[Op.and] = [
        whereClause[Op.or],
        {
          [Op.or]: [
            { title: { [Op.iLike]: `%${search}%` } },
            { description: { [Op.iLike]: `%${search}%` } },
            { destination: { [Op.iLike]: `%${search}%` } }
          ]
        }
      ];
      delete whereClause[Op.or];
    }

    // Calculate pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get itineraries with pagination
    const { count, rows: itineraries } = await Itinerary.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
        },
        {
          model: Collaborator,
          as: 'collaboratorRecords',
          required: false,
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
            }
          ]
        },
        {
          model: ItineraryItem,
          as: 'items',
          attributes: ['id', 'type', 'title', 'startTime', 'cost']
        }
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: offset,
      distinct: true
    });

    // Calculate summary statistics for each itinerary
    const itinerariesWithStats = itineraries.map(itinerary => {
      const itineraryData = itinerary.toJSON();
      
      // Calculate total cost
      const totalCost = itineraryData.items.reduce((sum, item) => {
        return sum + (parseFloat(item.cost) || 0);
      }, 0);

      // Count items by type
      const itemCounts = itineraryData.items.reduce((counts, item) => {
        counts[item.type] = (counts[item.type] || 0) + 1;
        return counts;
      }, {});

      return {
        ...itineraryData,
        stats: {
          totalCost,
          totalItems: itineraryData.items.length,
          itemCounts
        }
      };
    });

    res.json({
      success: true,
      data: {
        itineraries: itinerariesWithStats,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / parseInt(limit)),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get itineraries error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch itineraries'
      }
    });
  }
});

// POST /api/itineraries - Create new itinerary
router.post('/', validateCreateItinerary, handleValidationErrors, async (req, res) => {
  try {
    const { title, description, destination, startDate, endDate, budget, currency = 'USD', isPublic = false } = req.body;
    const userId = req.user.id;

    const itinerary = await Itinerary.create({
      title,
      description,
      destination,
      startDate,
      endDate,
      budget,
      currency,
      ownerId: userId,
      isPublic
    });

    // Fetch the created itinerary with owner information
    const createdItinerary = await Itinerary.findByPk(itinerary.id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: {
        itinerary: createdItinerary
      },
      message: 'Itinerary created successfully'
    });

  } catch (error) {
    console.error('Create itinerary error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'CREATE_ERROR',
        message: 'Failed to create itinerary'
      }
    });
  }
});

// GET /api/itineraries/:id - Get specific itinerary
router.get('/:id', validateItineraryId, handleValidationErrors, checkItineraryAccess, async (req, res) => {
  try {
    const itinerary = await Itinerary.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
        },
        {
          model: Collaborator,
          as: 'collaboratorRecords',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
            }
          ]
        },
        {
          model: ItineraryItem,
          as: 'items',
          include: [
            {
              model: User,
              as: 'creator',
              attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
            }
          ],
          order: [['startTime', 'ASC']]
        }
      ]
    });

    // Calculate summary statistics
    const itineraryData = itinerary.toJSON();
    const totalCost = itineraryData.items.reduce((sum, item) => {
      return sum + (parseFloat(item.cost) || 0);
    }, 0);

    const itemCounts = itineraryData.items.reduce((counts, item) => {
      counts[item.type] = (counts[item.type] || 0) + 1;
      return counts;
    }, {});

    res.json({
      success: true,
      data: {
        itinerary: {
          ...itineraryData,
          stats: {
            totalCost,
            totalItems: itineraryData.items.length,
            itemCounts
          }
        },
        userRole: req.userRole
      }
    });

  } catch (error) {
    console.error('Get itinerary error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch itinerary'
      }
    });
  }
});

// PUT /api/itineraries/:id - Update itinerary
router.put('/:id', validateItineraryId, validateUpdateItinerary, handleValidationErrors, checkItineraryEditAccess, async (req, res) => {
  try {
    const { title, description, destination, startDate, endDate, budget, currency, isPublic } = req.body;
    const itineraryId = req.params.id;

    // Build update object with only provided fields
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (destination !== undefined) updateData.destination = destination;
    if (startDate !== undefined) updateData.startDate = startDate;
    if (endDate !== undefined) updateData.endDate = endDate;
    if (budget !== undefined) updateData.budget = budget;
    if (currency !== undefined) updateData.currency = currency;
    if (isPublic !== undefined) updateData.isPublic = isPublic;

    // Update the itinerary
    const [updatedRowsCount] = await Itinerary.update(updateData, {
      where: { id: itineraryId }
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ITINERARY_NOT_FOUND',
          message: 'Itinerary not found'
        }
      });
    }

    // Fetch updated itinerary
    const updatedItinerary = await Itinerary.findByPk(itineraryId, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
        }
      ]
    });

    res.json({
      success: true,
      data: {
        itinerary: updatedItinerary
      },
      message: 'Itinerary updated successfully'
    });

  } catch (error) {
    console.error('Update itinerary error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'UPDATE_ERROR',
        message: 'Failed to update itinerary'
      }
    });
  }
});

// DELETE /api/itineraries/:id - Delete itinerary
router.delete('/:id', validateItineraryId, handleValidationErrors, checkItineraryOwnership, async (req, res) => {
  try {
    const itineraryId = req.params.id;

    // Delete the itinerary (cascade will handle related records)
    const deletedRowsCount = await Itinerary.destroy({
      where: { id: itineraryId }
    });

    if (deletedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ITINERARY_NOT_FOUND',
          message: 'Itinerary not found'
        }
      });
    }

    res.json({
      success: true,
      message: 'Itinerary deleted successfully'
    });

  } catch (error) {
    console.error('Delete itinerary error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DELETE_ERROR',
        message: 'Failed to delete itinerary'
      }
    });
  }
});

// GET /api/itineraries/:id/duplicate - Duplicate an itinerary
router.post('/:id/duplicate', validateItineraryId, handleValidationErrors, checkItineraryAccess, async (req, res) => {
  try {
    const originalItinerary = req.itinerary;
    const userId = req.user.id;

    // Create new itinerary with copied data
    const duplicatedItinerary = await Itinerary.create({
      title: `${originalItinerary.title} (Copy)`,
      description: originalItinerary.description,
      destination: originalItinerary.destination,
      startDate: originalItinerary.startDate,
      endDate: originalItinerary.endDate,
      budget: originalItinerary.budget,
      currency: originalItinerary.currency,
      ownerId: userId,
      isPublic: false // Always make copies private
    });

    // Fetch the created itinerary with owner information
    const createdItinerary = await Itinerary.findByPk(duplicatedItinerary.id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: {
        itinerary: createdItinerary
      },
      message: 'Itinerary duplicated successfully'
    });

  } catch (error) {
    console.error('Duplicate itinerary error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DUPLICATE_ERROR',
        message: 'Failed to duplicate itinerary'
      }
    });
  }
});

module.exports = router;