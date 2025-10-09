import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Marketplace.css';

const Marketplace = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/products');
  };

  const handleLoginClick = () => {
    // Navigate to login page with client as default user type
    navigate('/login?type=client');
  };

  return (
    <div className="marketplace">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/" className="nav-item">Marketplace</Link>
          <Link to="/profile" className="nav-item">Profile</Link>
        </div>
        <div className="nav-right">
          <button className="login-btn" onClick={handleLoginClick}>
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">Discover unique handmade creations</h1>
        <p className="hero-subtitle">
          book workshops, and connect directly with talented makers - all in one place.
        </p>
        <button className="explore-btn" onClick={handleExploreClick}>
          Explore
        </button>
      </section>

      {/* Products/Items Grid */}
      <section className="products-section">
        <div className="products-grid">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="product-card">
              <div className="product-image">
                <div className="image-placeholder"></div>
              </div>
              <div className="product-info">
                <h3 className="product-title">Inside 1000</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Marketplace;