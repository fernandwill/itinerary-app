const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ItineraryItem = sequelize.define('ItineraryItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  itineraryId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'itineraries',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('accommodation', 'activity', 'restaurant', 'transportation'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 255]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  location: {
    type: DataTypes.JSONB,
    allowNull: true,
    validate: {
      isValidLocation(value) {
        if (value && typeof value === 'object') {
          if (!value.name || typeof value.name !== 'string') {
            throw new Error('Location must have a name');
          }
          if (value.coordinates) {
            if (!value.coordinates.lat || !value.coordinates.lng) {
              throw new Error('Coordinates must have lat and lng');
            }
            if (typeof value.coordinates.lat !== 'number' || typeof value.coordinates.lng !== 'number') {
              throw new Error('Coordinates must be numbers');
            }
          }
        }
      }
    }
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true
    }
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true,
    validate: {
      isDate: true,
      isAfterStartTime(value) {
        if (value && value <= this.startTime) {
          throw new Error('End time must be after start time');
        }
      }
    }
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  photos: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'itinerary_items',
  timestamps: true,
  indexes: [
    {
      fields: ['itineraryId']
    },
    {
      fields: ['type']
    },
    {
      fields: ['startTime']
    },
    {
      fields: ['createdBy']
    }
  ]
});

module.exports = ItineraryItem;