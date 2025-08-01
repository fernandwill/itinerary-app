import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components will be imported here as they are created
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ItineraryView from './components/ItineraryView';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/itinerary/:id" element={<ItineraryView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;