const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Collaborator = sequelize.define('Collaborator', {
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
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  role: {
    type: DataTypes.ENUM('viewer', 'editor', 'admin'),
    allowNull: false,
    defaultValue: 'viewer'
  },
  invitedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  acceptedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'collaborators',
  timestamps: true,
  indexes: [
    {
      fields: ['itineraryId']
    },
    {
      fields: ['userId']
    },
    {
      unique: true,
      fields: ['itineraryId', 'userId']
    }
  ]
});

module.exports = Collaborator;