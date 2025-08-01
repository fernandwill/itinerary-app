# Itinerary Management API Documentation

## Overview

The Wanderlog itinerary management API provides comprehensive CRUD operations for travel itineraries. It includes features for creating, reading, updating, and deleting itineraries with proper authorization, validation, and collaboration support.

## Features

- ✅ Complete CRUD operations for itineraries
- ✅ Role-based access control (owner, collaborator, public)
- ✅ Search and pagination functionality
- ✅ Input validation and sanitization
- ✅ Itinerary duplication
- ✅ Statistics and cost tracking
- ✅ Comprehensive error handling
- ✅ Authorization middleware

## API Endpoints

### GET /api/itineraries

Get user's itineraries with pagination and search.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term for title, description, or destination
- `sortBy` (optional): Sort field (default: 'createdAt')
- `sortOrder` (optional): Sort order 'ASC' or 'DESC' (default: 'DESC')

**Response (200):**
```json
{
  "success": true,
  "data": {
    "itineraries": [
      {
        "id": "uuid",
        "title": "Tokyo Adventure",
        "description": "A week-long exploration of Tokyo",
        "destination": "Tokyo, Japan",
        "startDate": "2024-06-01",
        "endDate": "2024-06-07",
        "budget": "2500.00",
        "currency": "USD",
        "isPublic": false,
        "ownerId": "uuid",
        "owner": {
          "id": "uuid",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com",
          "avatar": null
        },
        "collaboratorRecords": [],
        "items": [
          {
            "id": "uuid",
            "type": "accommodation",
            "title": "Hotel Gracery",
            "startTime": "2024-06-01T15:00:00.000Z",
            "cost": "150.00"
          }
        ],
        "stats": {
          "totalCost": 150.00,
          "totalItems": 1,
          "itemCounts": {
            "accommodation": 1
          }
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 1,
      "itemsPerPage": 10
    }
  }
}
```

### POST /api/itineraries

Create a new itinerary.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "title": "Tokyo Adventure",
  "description": "A week-long exploration of Tokyo",
  "destination": "Tokyo, Japan",
  "startDate": "2024-06-01",
  "endDate": "2024-06-07",
  "budget": 2500.00,
  "currency": "USD",
  "isPublic": false
}
```

**Validation Rules:**
- `title`: Required, 1-255 characters
- `description`: Optional, max 2000 characters
- `destination`: Required, 1-255 characters
- `startDate`: Required, valid date (YYYY-MM-DD), cannot be in the past
- `endDate`: Required, valid date, must be after start date
- `budget`: Optional, positive number
- `currency`: Optional, 3-letter uppercase code (default: USD)
- `isPublic`: Optional, boolean (default: false)

**Response (201):**
```json
{
  "success": true,
  "data": {
    "itinerary": {
      "id": "uuid",
      "title": "Tokyo Adventure",
      "description": "A week-long exploration of Tokyo",
      "destination": "Tokyo, Japan",
      "startDate": "2024-06-01",
      "endDate": "2024-06-07",
      "budget": "2500.00",
      "currency": "USD",
      "isPublic": false,
      "ownerId": "uuid",
      "owner": {
        "id": "uuid",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "avatar": null
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "Itinerary created successfully"
}
```

### GET /api/itineraries/:id

Get a specific itinerary with full details.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Parameters:**
- `id`: Itinerary UUID

**Access Control:**
- Owner: Full access
- Collaborator: Access based on role
- Public: Access if itinerary is public

**Response (200):**
```json
{
  "success": true,
  "data": {
    "itinerary": {
      "id": "uuid",
      "title": "Tokyo Adventure",
      "description": "A week-long exploration of Tokyo",
      "destination": "Tokyo, Japan",
      "startDate": "2024-06-01",
      "endDate": "2024-06-07",
      "budget": "2500.00",
      "currency": "USD",
      "isPublic": false,
      "ownerId": "uuid",
      "owner": {
        "id": "uuid",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "avatar": null
      },
      "collaboratorRecords": [
        {
          "id": "uuid",
          "role": "editor",
          "invitedAt": "2024-01-01T00:00:00.000Z",
          "acceptedAt": "2024-01-01T00:00:00.000Z",
          "user": {
            "id": "uuid",
            "firstName": "Jane",
            "lastName": "Smith",
            "email": "jane@example.com",
            "avatar": null
          }
        }
      ],
      "items": [
        {
          "id": "uuid",
          "type": "accommodation",
          "title": "Hotel Gracery",
          "description": "Modern hotel in Shinjuku",
          "location": {
            "name": "Hotel Gracery Shinjuku",
            "address": "1-19-1 Kabukicho, Shinjuku City, Tokyo",
            "coordinates": {
              "lat": 35.6938,
              "lng": 139.7034
            }
          },
          "startTime": "2024-06-01T15:00:00.000Z",
          "endTime": "2024-06-07T11:00:00.000Z",
          "cost": "150.00",
          "notes": "Check-in after 3 PM",
          "photos": [],
          "creator": {
            "id": "uuid",
            "firstName": "John",
            "lastName": "Doe",
            "email": "john@example.com",
            "avatar": null
          },
          "createdAt": "2024-01-01T00:00:00.000Z",
          "updatedAt": "2024-01-01T00:00:00.000Z"
        }
      ],
      "stats": {
        "totalCost": 150.00,
        "totalItems": 1,
        "itemCounts": {
          "accommodation": 1
        }
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "userRole": "owner"
  }
}
```

### PUT /api/itineraries/:id

Update an existing itinerary.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Parameters:**
- `id`: Itinerary UUID

**Access Control:**
- Owner: Full edit access
- Editor/Admin Collaborator: Edit access
- Viewer Collaborator: No edit access

**Request Body (all fields optional):**
```json
{
  "title": "Updated Tokyo Adventure",
  "description": "Updated description",
  "destination": "Tokyo, Japan",
  "startDate": "2024-06-01",
  "endDate": "2024-06-07",
  "budget": 3000.00,
  "currency": "USD",
  "isPublic": true
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "itinerary": {
      "id": "uuid",
      "title": "Updated Tokyo Adventure",
      "description": "Updated description",
      "destination": "Tokyo, Japan",
      "startDate": "2024-06-01",
      "endDate": "2024-06-07",
      "budget": "3000.00",
      "currency": "USD",
      "isPublic": true,
      "ownerId": "uuid",
      "owner": {
        "id": "uuid",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "avatar": null
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  },
  "message": "Itinerary updated successfully"
}
```

### DELETE /api/itineraries/:id

Delete an itinerary (owner only).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Parameters:**
- `id`: Itinerary UUID

**Access Control:**
- Owner: Delete access
- Collaborator: No delete access

**Response (200):**
```json
{
  "success": true,
  "message": "Itinerary deleted successfully"
}
```

### POST /api/itineraries/:id/duplicate

Duplicate an existing itinerary.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Parameters:**
- `id`: Itinerary UUID

**Access Control:**
- Owner: Can duplicate
- Collaborator: Can duplicate
- Public: Can duplicate if itinerary is public

**Response (201):**
```json
{
  "success": true,
  "data": {
    "itinerary": {
      "id": "new-uuid",
      "title": "Tokyo Adventure (Copy)",
      "description": "A week-long exploration of Tokyo",
      "destination": "Tokyo, Japan",
      "startDate": "2024-06-01",
      "endDate": "2024-06-07",
      "budget": "2500.00",
      "currency": "USD",
      "isPublic": false,
      "ownerId": "current-user-uuid",
      "owner": {
        "id": "current-user-uuid",
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane@example.com",
        "avatar": null
      },
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  },
  "message": "Itinerary duplicated successfully"
}
```

## Authorization Levels

### Owner
- Full CRUD access to itinerary
- Can manage collaborators
- Can delete itinerary
- Can change privacy settings

### Admin Collaborator
- Edit itinerary details
- Add/edit/delete items
- Manage other collaborators
- Cannot delete itinerary

### Editor Collaborator
- Edit itinerary details
- Add/edit/delete items
- Cannot manage collaborators
- Cannot delete itinerary

### Viewer Collaborator
- Read-only access
- Can view all details
- Cannot edit anything

### Public Access
- Read-only access to public itineraries
- Limited information visibility
- Cannot edit anything

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Input validation failed |
| `ITINERARY_NOT_FOUND` | Itinerary does not exist |
| `ACCESS_DENIED` | No permission to access itinerary |
| `EDIT_ACCESS_DENIED` | No permission to edit itinerary |
| `CREATE_ERROR` | Failed to create itinerary |
| `UPDATE_ERROR` | Failed to update itinerary |
| `DELETE_ERROR` | Failed to delete itinerary |
| `DUPLICATE_ERROR` | Failed to duplicate itinerary |
| `FETCH_ERROR` | Failed to fetch itinerary data |
| `AUTHORIZATION_ERROR` | Authorization check failed |

## Usage Examples

### Frontend Integration

```javascript
// Get user itineraries with search
const getItineraries = async (token, page = 1, search = '') => {
  const response = await fetch(`/api/itineraries?page=${page}&search=${search}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};

// Create new itinerary
const createItinerary = async (token, itineraryData) => {
  const response = await fetch('/api/itineraries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(itineraryData),
  });
  return response.json();
};

// Update itinerary
const updateItinerary = async (token, id, updateData) => {
  const response = await fetch(`/api/itineraries/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });
  return response.json();
};

// Delete itinerary
const deleteItinerary = async (token, id) => {
  const response = await fetch(`/api/itineraries/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};
```

## Testing

Run itinerary tests:
```bash
npm test -- itineraries.test.js
```

The test suite covers:
- CRUD operations with proper authorization
- Input validation scenarios
- Search and pagination functionality
- Collaboration access control
- Itinerary duplication
- Error handling scenarios