import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './Requests_A.css';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import RequestCard from "../../components/RequestCard";

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

  const [filter, setFilter] = useState('all');

  // تصفية الطلبات حسب الحالة
  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  // معالج تحديث حالة الطلب
  const handleUpdateRequestStatus = (requestId, newStatus) => {
    setRequests(requests.map(request => 
      request.id === requestId 
        ? { ...request, status: newStatus }
        : request
    ));
  };

  return (
    <div className="requests-page">
      {/* ===== Navbar ===== */}
      <Navbar />

      {/* المحتوى الرئيسي */}
      <main className="container py-5">

        {/* عنوان القسم */}
        <section className="section-header">
          <h5 className="section-title">Requests</h5>
        </section>

        {/* فلتر الطلبات */}
        <section className="filters-section">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button 
              className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
              onClick={() => setFilter('approved')}
            >
              Approved
            </button>
            <button 
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>
        </section>

        {/* قائمة الطلبات */}
        <section className="requests-section">
          
          <div className="requests-grid">
            {filteredRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onUpdateStatus={handleUpdateRequestStatus}
              />
            ))}
          </div>

          {filteredRequests.length === 0 && (
            <div className="no-requests">
              <p>No requests found in this category</p>
            </div>
          )}
        </section>
      </main>

      {/* ===== Footer ===== */}
      <Footer />
    </div>
  );
};

export default Requests;