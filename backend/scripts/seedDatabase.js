const { User, Itinerary, ItineraryItem, Collaborator } = require('../models');

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Create sample users
    const user1 = await User.create({
      email: 'john.doe@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe'
    });

    const user2 = await User.create({
      email: 'jane.smith@example.com',
      password: 'password123',
      firstName: 'Jane',
      lastName: 'Smith'
    });

    console.log('Sample users created.');

    // Create sample itinerary
    const itinerary = await Itinerary.create({
      title: 'Tokyo Adventure 2024',
      description: 'A week-long exploration of Tokyo, Japan',
      destination: 'Tokyo, Japan',
      startDate: '2024-03-15',
      endDate: '2024-03-22',
      budget: 2500.00,
      currency: 'USD',
      ownerId: user1.id,
      isPublic: false
    });

    console.log('Sample itinerary created.');

    // Create sample itinerary items
    const items = [
      {
        itineraryId: itinerary.id,
        type: 'accommodation',
        title: 'Hotel Gracery Shinjuku',
        description: 'Modern hotel in the heart of Shinjuku',
        location: {
          name: 'Hotel Gracery Shinjuku',
          address: '1-19-1 Kabukicho, Shinjuku City, Tokyo 160-8330, Japan',
          coordinates: {
            lat: 35.6938,
            lng: 139.7034
          }
        },
        startTime: '2024-03-15T15:00:00Z',
        endTime: '2024-03-22T11:00:00Z',
        cost: 150.00,
        notes: 'Check-in after 3 PM',
        createdBy: user1.id
      },
      {
        itineraryId: itinerary.id,
        type: 'activity',
        title: 'Visit Senso-ji Temple',
        description: 'Ancient Buddhist temple in Asakusa',
        location: {
          name: 'Senso-ji Temple',
          address: '2-3-1 Asakusa, Taito City, Tokyo 111-0032, Japan',
          coordinates: {
            lat: 35.7148,
            lng: 139.7967
          }
        },
        startTime: '2024-03-16T09:00:00Z',
        endTime: '2024-03-16T11:00:00Z',
        cost: 0.00,
        notes: 'Free admission, arrive early to avoid crowds',
        createdBy: user1.id
      },
      {
        itineraryId: itinerary.id,
        type: 'restaurant',
        title: 'Sushi Jiro Honten',
        description: 'World-famous sushi restaurant',
        location: {
          name: 'Sushi Jiro Honten',
          address: 'Tsukamoto Sogyo Building B1F, 2-15 Kyoboshi, Chuo City, Tokyo 104-0045, Japan',
          coordinates: {
            lat: 35.6654,
            lng: 139.7707
          }
        },
        startTime: '2024-03-17T19:00:00Z',
        endTime: '2024-03-17T21:00:00Z',
        cost: 300.00,
        notes: 'Reservation required, omakase menu only',
        createdBy: user1.id
      },
      {
        itineraryId: itinerary.id,
        type: 'transportation',
        title: 'JR Pass - 7 Day',
        description: 'Japan Rail Pass for unlimited travel',
        location: {
          name: 'Tokyo Station',
          address: '1 Chome Marunouchi, Chiyoda City, Tokyo 100-0005, Japan',
          coordinates: {
            lat: 35.6812,
            lng: 139.7671
          }
        },
        startTime: '2024-03-15T08:00:00Z',
        endTime: '2024-03-22T23:59:00Z',
        cost: 280.00,
        notes: 'Pick up at Tokyo Station, valid for 7 consecutive days',
        createdBy: user1.id
      }
    ];

    await ItineraryItem.bulkCreate(items);
    console.log('Sample itinerary items created.');

    // Create sample collaboration
    await Collaborator.create({
      itineraryId: itinerary.id,
      userId: user2.id,
      role: 'editor',
      acceptedAt: new Date()
    });

    console.log('Sample collaboration created.');
    console.log('Database seeding completed successfully!');

  } catch (error) {
    console.error('Database seeding failed:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedDatabase;