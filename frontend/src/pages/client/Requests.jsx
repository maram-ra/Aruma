import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './Requests.css';

const Requests = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      client: "Fatima.A",
      type: "workshop",
      message: "I'm interested in ordering a handmade ceramic tea set. I'd like it to include six cups and a matching teapot.",
      date: "Sep 28, 2025",
      status: "pending"
    },
    {
      id: 2,
      client: "Fatima.A",
      type: "workshop",
      message: "I'm interested in ordering a handmade ceramic tea set. I'd like it to include six cups and a matching teapot.",
      date: "Sep 28, 2025",
      status: "pending"
    },
    {
      id: 3,
      client: "Fatima.A",
      type: "workshop",
      message: "I'm interested in ordering a handmade ceramic tea set. I'd like it to include six cups and a matching teapot.",
      date: "Sep 28, 2025",
      status: "approved"
    },
    {
      id: 4,
      client: "Fatima.A",
      type: "workshop",
      message: "I'm interested in ordering a handmade ceramic tea set. I'd like it to include six cups and a matching teapot.",
      date: "Sep 28, 2025",
      status: "completed"
    }
  ]);

  const handleAccept = (requestId) => {
    setRequests(requests.map(request => 
      request.id === requestId 
        ? { ...request, status: "approved" }
        : request
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#FFA500';
      case 'approved': return '#28A745';
      case 'rejected': return '#DC3545';
      case 'completed': return '#6C757D';
      default: return '#6C757D';
    }
  };

  return (
    <div className="requests-page">
      {/* الهيدر */}
      <header className="requests-header">
        <div className="header-content">
          {/* Logo Center */}
          <a href="#" className="navbar-brand m-0">
            <img src="../logo.png" alt="Aruma Logo" width="65" />
          </a>
          <div className="header-actions">
            <span className="welcome-text">Welcome back, Fatima.A</span>
            <button className="logout-btn">Logout</button>
            <a href="/Marketplace" className="Marketplace-link">Marketplace</a>
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="requests-main">
        {/* قسم الترحيب */}
        <section className="welcome-section">
          <h2>Welcome back, Fatima.A</h2>
          <p className="welcome-description">
            Here you can track your requests, view contract updates, and send new requests to artisans.
          </p>
        </section>

        {/* قائمة الطلبات */}
        <section className="requests-section">
          <h3 className="section-title">Your Requests</h3>
          
          <div className="requests-grid">
            {requests.map((request) => (
              <div key={request.id} className="request-card">
                <div className="request-header">
                  <div className="request-meta">
                    <span className="client">Client: {request.client}</span>
                    <span className="type">Type: {request.type}</span>
                  </div>
                </div>

                <div className="request-body">
                  <p className="message-label">Message:</p>
                  <p className="message">{request.message}</p>
                  <span className="date">Date: {request.date}</span>
                </div>

                <div className="request-actions">
                  {request.status === 'pending' && (
                    <button 
                      className="accept-btn"
                      onClick={() => handleAccept(request.id)}
                    >
                      Accept
                    </button>
                  )}
                </div>

                <div className="request-status">
                  <span className="status-label">Status:</span>
                  <div className="status-badges">
                    <span 
                      className={`status-badge ${request.status === 'pending' ? 'active' : ''}`}
                      style={{ 
                        color: request.status === 'pending' ? getStatusColor('pending') : '#6C757D',
                        borderColor: request.status === 'pending' ? getStatusColor('pending') : '#DEE2E6'
                      }}
                    >
                      Pending
                    </span>
                    <span 
                      className={`status-badge ${request.status === 'approved' ? 'active' : ''}`}
                      style={{ 
                        color: request.status === 'approved' ? getStatusColor('approved') : '#6C757D',
                        borderColor: request.status === 'approved' ? getStatusColor('approved') : '#DEE2E6'
                      }}
                    >
                      Approved
                    </span>
                    <span 
                      className={`status-badge ${request.status === 'rejected' ? 'active' : ''}`}
                      style={{ 
                        color: request.status === 'rejected' ? getStatusColor('rejected') : '#6C757D',
                        borderColor: request.status === 'rejected' ? getStatusColor('rejected') : '#DEE2E6'
                      }}
                    >
                      Rejected
                    </span>
                    <span 
                      className={`status-badge ${request.status === 'completed' ? 'active' : ''}`}
                      style={{ 
                        color: request.status === 'completed' ? getStatusColor('completed') : '#6C757D',
                        borderColor: request.status === 'completed' ? getStatusColor('completed') : '#DEE2E6'
                      }}
                    >
                      Completed
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* الفوتر */}
      <footer className="requests-footer">
        <div className="footer-content">
          <a href="/about" className="footer-link">About Us</a>
          <a href="/terms" className="footer-link">Terms of Service</a>
          <a href="/privacy" className="footer-link">Privacy Policy</a>
          <a href="/contact" className="footer-link">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default Requests;