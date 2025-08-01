import React from 'react';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="container">
        <h2>Your Travel Itineraries</h2>
        <p>Welcome to Wanderlog! This is where your itineraries will be displayed.</p>
        <div className="card">
          <h3>Getting Started</h3>
          <p>Create your first itinerary to start planning your next adventure!</p>
          <button className="btn btn-primary">Create New Itinerary</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;