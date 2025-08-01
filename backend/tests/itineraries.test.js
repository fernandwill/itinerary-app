const request = require('supertest');
const express = require('express');
const { sequelize, User, Itinerary, ItineraryItem, Collaborator } = require('../models');
const itineraryRoutes = require('../routes/itineraries');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/itineraries', itineraryRoutes);

// Test data
const testUser1 = {
  email: 'user1@example.com',
  password: 'TestPass123',
  firstName: 'John',
  lastName: 'Doe'
};

const testUser2 = {
  email: 'user2@example.com',
  password: 'TestPass123',
  firstName: 'Jane',
  lastName: 'Smith'
};

const testItinerary = {
  title: 'Tokyo Adventure',
  description: 'A week-long exploration of Tokyo',
  destination: 'Tokyo, Japan',
  startDate: '2024-06-01',
  endDate: '2024-06-07',
  budget: 2500.00,
  currency: 'USD',
  isPublic: false
};

describe('Itinerary Management Endpoints', () => {
  let user1, user2, authToken1, authToken2;

  beforeAll(async () => {
    // Set up test environment
    process.env.JWT_SECRET = 'test-secret-key';
    process.env.JWT_EXPIRES_IN = '1h';
    
    // Sync database for testing
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Clean up
    await sequelize.close();
  });

  beforeEach(async () => {
    // Clean up data before each test
    await ItineraryItem.destroy({ where: {} });
    await Collaborator.destroy({ where: {} });
    await Itinerary.destroy({ where: {} });
    await User.destroy({ where: {} });

    // Create test users
    user1 = await User.create(testUser1);
    user2 = await User.create(testUser2);

    // Get auth tokens
    const loginResponse1 = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser1.email,
        password: testUser1.password
      });
    authToken1 = loginResponse1.body.data.token;

    const loginResponse2 = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser2.email,
        password: testUser2.password
      });
    authToken2 = loginResponse2.body.data.token;
  });

  describe('POST /api/itineraries', () => {
    it('should create a new itinerary successfully', async () => {
      const response = await request(app)
        .post('/api/itineraries')
        .set('Authorization', `Bearer ${authToken1}`)
        .send(testItinerary)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.itinerary.title).toBe(testItinerary.title);
      expect(response.body.data.itinerary.destination).toBe(testItinerary.destination);
      expect(response.body.data.itinerary.ownerId).toBe(user1.id);
      expect(response.body.data.itinerary.owner).toBeDefined();
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/itineraries')
        .set('Authorization', `Bearer ${authToken1}`)
        .send({
          title: '', // empty title
          destination: 'Tokyo',
          startDate: '2024-06-01',
          endDate: '2024-05-30' // end date before start date
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(response.body.error.details).toHaveLength(2);
    });

    it('should not create itinerary without authentication', async () => {
      const response = await request(app)
        .post('/api/itineraries')
        .send(testItinerary)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('NO_TOKEN');
    });
  });

  describe('GET /api/itineraries', () => {
    let itinerary1, itinerary2;

    beforeEach(async () => {
      // Create test itineraries
      itinerary1 = await Itinerary.create({
        ...testItinerary,
        ownerId: user1.id
      });

      itinerary2 = await Itinerary.create({
        ...testItinerary,
        title: 'Paris Trip',
        destination: 'Paris, France',
        ownerId: user2.id
      });

      // Add collaboration
      await Collaborator.create({
        itineraryId: itinerary2.id,
        userId: user1.id,
        role: 'editor',
        acceptedAt: new Date()
      });
    });

    it('should get user itineraries with pagination', async () => {
      const response = await request(app)
        .get('/api/itineraries?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken1}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.itineraries).toHaveLength(2); // owned + collaborated
      expect(response.body.data.pagination).toBeDefined();
      expect(response.body.data.pagination.currentPage).toBe(1);
    });

    it('should search itineraries by title', async () => {
      const response = await request(app)
        .get('/api/itineraries?search=Tokyo')
        .set('Authorization', `Bearer ${authToken1}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.itineraries).toHaveLength(1);
      expect(response.body.data.itineraries[0].title).toContain('Tokyo');
    });

    it('should not get itineraries without authentication', async () => {
      const response = await request(app)
        .get('/api/itineraries')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('NO_TOKEN');
    });
  });

  describe('GET /api/itineraries/:id', () => {
    let itinerary;

    beforeEach(async () => {
      itinerary = await Itinerary.create({
        ...testItinerary,
        ownerId: user1.id
      });
    });

    it('should get specific itinerary for owner', async () => {
      const response = await request(app)
        .get(`/api/itineraries/${itinerary.id}`)
        .set('Authorization', `Bearer ${authToken1}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.itinerary.id).toBe(itinerary.id);
      expect(response.body.data.itinerary.stats).toBeDefined();
      expect(response.body.data.userRole).toBe('owner');
    });

    it('should not get private itinerary for non-owner', async () => {
      const response = await request(app)
        .get(`/api/itineraries/${itinerary.id}`)
        .set('Authorization', `Bearer ${authToken2}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('ACCESS_DENIED');
    });

    it('should get public itinerary for any user', async () => {
      // Make itinerary public
      await itinerary.update({ isPublic: true });

      const response = await request(app)
        .get(`/api/itineraries/${itinerary.id}`)
        .set('Authorization', `Bearer ${authToken2}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.userRole).toBe('public');
    });

    it('should return 404 for non-existent itinerary', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';
      const response = await request(app)
        .get(`/api/itineraries/${fakeId}`)
        .set('Authorization', `Bearer ${authToken1}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('ITINERARY_NOT_FOUND');
    });
  });

  describe('PUT /api/itineraries/:id', () => {
    let itinerary;

    beforeEach(async () => {
      itinerary = await Itinerary.create({
        ...testItinerary,
        ownerId: user1.id
      });
    });

    it('should update itinerary for owner', async () => {
      const updateData = {
        title: 'Updated Tokyo Adventure',
        budget: 3000.00
      };

      const response = await request(app)
        .put(`/api/itineraries/${itinerary.id}`)
        .set('Authorization', `Bearer ${authToken1}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.itinerary.title).toBe(updateData.title);
      expect(parseFloat(response.body.data.itinerary.budget)).toBe(updateData.budget);
    });

    it('should not update itinerary for non-owner without edit permissions', async () => {
      const response = await request(app)
        .put(`/api/itineraries/${itinerary.id}`)
        .set('Authorization', `Bearer ${authToken2}`)
        .send({ title: 'Hacked Title' })
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('EDIT_ACCESS_DENIED');
    });

    it('should validate update data', async () => {
      const response = await request(app)
        .put(`/api/itineraries/${itinerary.id}`)
        .set('Authorization', `Bearer ${authToken1}`)
        .send({
          startDate: '2024-06-01',
          endDate: '2024-05-30' // end date before start date
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('DELETE /api/itineraries/:id', () => {
    let itinerary;

    beforeEach(async () => {
      itinerary = await Itinerary.create({
        ...testItinerary,
        ownerId: user1.id
      });
    });

    it('should delete itinerary for owner', async () => {
      const response = await request(app)
        .delete(`/api/itineraries/${itinerary.id}`)
        .set('Authorization', `Bearer ${authToken1}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Itinerary deleted successfully');

      // Verify itinerary is deleted
      const deletedItinerary = await Itinerary.findByPk(itinerary.id);
      expect(deletedItinerary).toBeNull();
    });

    it('should not delete itinerary for non-owner', async () => {
      const response = await request(app)
        .delete(`/api/itineraries/${itinerary.id}`)
        .set('Authorization', `Bearer ${authToken2}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('ACCESS_DENIED');
    });
  });

  describe('POST /api/itineraries/:id/duplicate', () => {
    let itinerary;

    beforeEach(async () => {
      itinerary = await Itinerary.create({
        ...testItinerary,
        ownerId: user1.id,
        isPublic: true
      });
    });

    it('should duplicate itinerary for any user with access', async () => {
      const response = await request(app)
        .post(`/api/itineraries/${itinerary.id}/duplicate`)
        .set('Authorization', `Bearer ${authToken2}`)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.itinerary.title).toBe(`${testItinerary.title} (Copy)`);
      expect(response.body.data.itinerary.ownerId).toBe(user2.id);
      expect(response.body.data.itinerary.isPublic).toBe(false); // Always private
    });

    it('should not duplicate private itinerary without access', async () => {
      await itinerary.update({ isPublic: false });

      const response = await request(app)
        .post(`/api/itineraries/${itinerary.id}/duplicate`)
        .set('Authorization', `Bearer ${authToken2}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('ACCESS_DENIED');
    });
  });
});