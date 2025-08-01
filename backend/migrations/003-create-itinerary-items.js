const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create ENUM type for item types
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_itinerary_items_type" AS ENUM ('accommodation', 'activity', 'restaurant', 'transportation');
    `);

    await queryInterface.createTable('itinerary_items', {
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
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      type: {
        type: DataTypes.ENUM('accommodation', 'activity', 'restaurant', 'transportation'),
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      location: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: true
      },
      cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
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
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('itinerary_items', ['itineraryId']);
    await queryInterface.addIndex('itinerary_items', ['type']);
    await queryInterface.addIndex('itinerary_items', ['startTime']);
    await queryInterface.addIndex('itinerary_items', ['createdBy']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('itinerary_items');
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_itinerary_items_type";
    `);
  }
};