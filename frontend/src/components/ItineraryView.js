import React from 'react';
import { useParams } from 'react-router-dom';

const ItineraryView = () => {
  const { id } = useParams();

  return (
    <div className="itinerary-view">
      <div className="container">
        <h2>Itinerary Details</h2>
        <p>Viewing itinerary with ID: {id}</p>
        <div className="card">
          <h3>Itinerary Content</h3>
          <p>This is where the detailed itinerary view will be implemented.</p>
        </div>
      </div>
    </div>
  );
};

export default ItineraryView;