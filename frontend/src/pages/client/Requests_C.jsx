import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import './Requests_C.css';

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
    <div>
    {/* ===== Navbar ===== */}
    <Navbar />


      {/* المحتوى الرئيسي */}
      <main className="container py-5">
        {/* قسم الترحيب */}
        <section className="row align-items-center justify-content-between">
          
          <h6>Welcome back, Fatima.A</h6>
          <p className="small mb-0" style={{ color: "#3a0b0b", lineHeight: "1.6" }}>
          Here you can track your requests, view contract updates, and send new requests to artisans.
          </p>
        </section>


        <section className="container py-5 text-md-start">
      {/* ===== Section Title ===== */}
      <h5
        className="mb-4 fw-bold"
        style={{
        color: "#3a0b0b",
        }}
      >
      Your Requests
      </h5></section>

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

      {/* ===== Footer ===== */}
      <Footer />
    </div>
  );
};

export default Requests;