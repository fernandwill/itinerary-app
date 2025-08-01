import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>Wanderlog</h1>
          </Link>
          <nav className="nav">
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;