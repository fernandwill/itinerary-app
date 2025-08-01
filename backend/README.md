# Wanderlog Backend

## Database Setup

This backend uses PostgreSQL with Sequelize ORM for data management.

### Prerequisites

1. PostgreSQL installed and running
2. Node.js and npm installed
3. Environment variables configured

### Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the database configuration in `.env`:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=wanderlog_db
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   ```

### Database Commands

```bash
# Initialize database (run migrations)
npm run db:init

# Reset database (drop all tables and recreate)
npm run db:reset

# Seed database with sample data
npm run db:seed

# Start development server
npm run dev
```

## Database Schema

### Tables

1. **users** - User accounts and authentication
2. **itineraries** - Travel itinerary records
3. **itinerary_items** - Individual items within itineraries
4. **collaborators** - Collaboration permissions for itineraries

### Models

- **User**: Handles user authentication with bcrypt password hashing
- **Itinerary**: Main travel plan with budget tracking
- **ItineraryItem**: Individual activities, accommodations, restaurants, transportation
- **Collaborator**: Manages sharing and permissions (viewer, editor, admin roles)

### Relationships

- User owns multiple Itineraries (1:N)
- User creates multiple ItineraryItems (1:N)
- Itinerary contains multiple ItineraryItems (1:N)
- Users collaborate on Itineraries through Collaborator junction table (N:M)

## Development Workflow

1. Set up environment variables
2. Run `npm run db:init` to create database schema
3. Run `npm run db:seed` to add sample data
4. Start development with `npm run dev`

## Testing

The database models include comprehensive validation and constraints to ensure data integrity.