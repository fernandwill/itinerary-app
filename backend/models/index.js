const sequelize = require('../config/database');
const User = require('./User');
const Itinerary = require('./Itinerary');
const ItineraryItem = require('./ItineraryItem');
const Collaborator = require('./Collaborator');

// Define associations
// User associations
User.hasMany(Itinerary, {
  foreignKey: 'ownerId',
  as: 'ownedItineraries',
  onDelete: 'CASCADE'
});

User.hasMany(ItineraryItem, {
  foreignKey: 'createdBy',
  as: 'createdItems',
  onDelete: 'CASCADE'
});

User.belongsToMany(Itinerary, {
  through: Collaborator,
  foreignKey: 'userId',
  otherKey: 'itineraryId',
  as: 'collaboratedItineraries'
});

// Itinerary associations
Itinerary.belongsTo(User, {
  foreignKey: 'ownerId',
  as: 'owner'
});

Itinerary.hasMany(ItineraryItem, {
  foreignKey: 'itineraryId',
  as: 'items',
  onDelete: 'CASCADE'
});

Itinerary.belongsToMany(User, {
  through: Collaborator,
  foreignKey: 'itineraryId',
  otherKey: 'userId',
  as: 'collaborators'
});

Itinerary.hasMany(Collaborator, {
  foreignKey: 'itineraryId',
  as: 'collaboratorRecords',
  onDelete: 'CASCADE'
});

// ItineraryItem associations
ItineraryItem.belongsTo(Itinerary, {
  foreignKey: 'itineraryId',
  as: 'itinerary'
});

ItineraryItem.belongsTo(User, {
  foreignKey: 'createdBy',
  as: 'creator'
});

// Collaborator associations
Collaborator.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Collaborator.belongsTo(Itinerary, {
  foreignKey: 'itineraryId',
  as: 'itinerary'
});

// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  Itinerary,
  ItineraryItem,
  Collaborator
};