# Wanderlog Clone - Travel Itinerary Planner

A comprehensive travel itinerary planning application built with React and Node.js, inspired by Wanderlog.

## Features

- Create and manage travel itineraries
- Add various types of travel items (accommodations, activities, restaurants, transportation)
- Collaborative planning with real-time updates
- Interactive map and timeline views
- Budget tracking and expense management
- Mobile-responsive design with offline functionality

## Tech Stack

**Frontend:**
- React 18
- React Router
- Socket.io Client
- Axios for API calls

**Backend:**
- Node.js with Express.js
- PostgreSQL database
- Sequelize ORM
- Socket.io for real-time features
- JWT authentication
- Redis for caching

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- Redis (optional, for caching)

### Installation

1. Clone the repository and navigate to the project directory

2. Install all dependencies:
   ```bash
   npm run install:all
   ```

3. Set up environment variables:
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your database and API credentials
   ```

4. Set up the database:
   - Create a PostgreSQL database
   - Update the database connection details in `.env`
   - Run migrations (will be available after Task 2)

### Development

Start both frontend and backend in development mode:
```bash
npm run dev
```

This will start:
- Frontend on http://localhost:3000
- Backend on http://localhost:5000

### Individual Services

Start only the backend:
```bash
npm run dev:backend
```

Start only the frontend:
```bash
npm run dev:frontend
```

### Production Build

Build the frontend for production:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## API Endpoints

### Health Check
- `GET /api/health` - Server health check

### Authentication (Coming in Task 3)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Itineraries (Coming in Task 4)
- `GET /api/itineraries` - Get user itineraries
- `POST /api/itineraries` - Create new itinerary
- `GET /api/itineraries/:id` - Get specific itinerary
- `PUT /api/itineraries/:id` - Update itinerary
- `DELETE /api/itineraries/:id` - Delete itinerary

### Items (Coming in Task 5)
- `GET /api/items/:itineraryId` - Get itinerary items
- `POST /api/items/:itineraryId` - Add new item
- `PUT /api/items/:itineraryId/:itemId` - Update item
- `DELETE /api/items/:itineraryId/:itemId` - Delete item

### Collaboration (Coming in Task 6)
- `GET /api/collaborators/:itineraryId` - Get collaborators
- `POST /api/collaborators/:itineraryId` - Add collaborator
- `DELETE /api/collaborators/:itineraryId/:userId` - Remove collaborator

### Places (Coming in Task 11)
- `GET /api/places/search` - Search places
- `GET /api/places/directions` - Get directions

## Project Structure

```
itinerary-app/
├── frontend/                 # React frontend application
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.js          # Main App component
│   │   └── index.js        # Entry point
│   └── package.json
├── backend/                 # Node.js backend API
│   ├── routes/             # API route handlers
│   ├── models/             # Database models (coming in Task 2)
│   ├── middleware/         # Custom middleware (coming in Task 3)
│   ├── server.js           # Express server setup
│   └── package.json
├── docs/                   # Project documentation
│   ├── requirements.md     # Feature requirements
│   ├── design.md          # Technical design
│   └── tasks.md           # Implementation tasks
└── package.json           # Root package.json with scripts
```

## Development Status

✅ **Task 1: Project Structure** - Complete
- [x] Frontend and backend directory structure
- [x] React application initialization
- [x] Express.js server setup
- [x] Development scripts configuration

🔄 **Next Tasks:**
- Task 2: Database schema and models
- Task 3: Authentication system
- Task 4: Core itinerary management API

## Contributing

This project follows a task-driven development approach. See `docs/tasks.md` for the complete implementation plan.

## License

MIT License