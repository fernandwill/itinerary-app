const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create ENUM type for collaborator roles
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_collaborators_role" AS ENUM ('viewer', 'editor', 'admin');
    `);

    await queryInterface.createTable('collaborators', {
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
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      role: {
        type: DataTypes.ENUM('viewer', 'editor', 'admin'),
        allowNull: false,
        defaultValue: 'viewer'
      },
      invitedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      acceptedAt: {
        type: DataTypes.DATE,
        allowNull: true
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
    await queryInterface.addIndex('collaborators', ['itineraryId']);
    await queryInterface.addIndex('collaborators', ['userId']);
    
    // Add unique constraint for itineraryId + userId combination
    await queryInterface.addConstraint('collaborators', {
      fields: ['itineraryId', 'userId'],
      type: 'unique',
      name: 'unique_itinerary_user_collaboration'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('collaborators');
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_collaborators_role";
    `);
  }
};