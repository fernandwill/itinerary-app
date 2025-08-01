const { sequelize } = require('../models');
const fs = require('fs');
const path = require('path');

async function initDatabase() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    console.log('Running migrations...');
    
    // Get all migration files
    const migrationsDir = path.join(__dirname, '../migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.js'))
      .sort();

    // Run each migration
    for (const file of migrationFiles) {
      console.log(`Running migration: ${file}`);
      const migration = require(path.join(migrationsDir, file));
      await migration.up(sequelize.getQueryInterface(), sequelize.constructor);
      console.log(`Migration ${file} completed successfully.`);
    }

    console.log('All migrations completed successfully!');
    console.log('Database schema created.');

  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run if called directly
if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;