import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Requests_C() {
  const [requests, setRequests] = useState([
    {
      id: 1,
      artisan: "Sara.Pottery",
      type: "Custom Pottery Set",
      message:
        "Requested a handmade tea set with six cups and a teapot for my home collection.",
      date: "Sep 28, 2025",
      status: "pending",
    },
    {
      id: 2,
      artisan: "Aisha.ClayWorks",
      type: "Workshop Registration",
      message:
        "Joined a weekend pottery workshop focusing on glazing and shaping techniques.",
      date: "Sep 20, 2025",
      status: "approved",
    },
    {
      id: 3,
      artisan: "Mona.Designs",
      type: "Live Show Participation",
      message:
        "Applied to join a live artisan show session during Aruma Craft Week.",
      date: "Aug 30, 2025",
      status: "in progress",
    },
    {
      id: 4,
      artisan: "Rawan.Ceramics",
      type: "Product Order",
      message: "Ordered a set of handmade espresso cups for my new kitchen.",
      date: "Jul 14, 2025",
      status: "completed",
    },
    {
      id: 5,
      artisan: "Rawan.Ceramics",
      type: "Product Order",
      message: "Ordered a set of handmade espresso cups for my new kitchen.",
      date: "Jul 14, 2025",
      status: "rejected",
    },
    {
      id: 6,
      artisan: "Rawan.Ceramics",
      type: "Product Order",
      message: "Ordered a set of handmade espresso cups for my new kitchen.",
      date: "Jul 14, 2025",
      status: "canceled",
    },
  ]);

  const [filter, setFilter] = useState("all");
  const [showContractModal, setShowContractModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#d4a017";
      case "approved":
        return "#3c7c59";
      case "in progress":
        return "#29648a";
      case "rejected":
        return "#a13a3a";
      case "completed":
        return "#3a0b0b";
      case "canceled":
        return "#a13a3a";
      default:
        return "#6c757d";
    }
  };

  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter((req) => req.status === filter);

  const getCount = (status) =>
    status === "all"
      ? requests.length
      : requests.filter((r) => r.status === status).length;

  // Sample contract data - you can replace this with actual data from your backend
  const contractData = {
    artisan: "Aisha.ClayWorks",
    type: "Workshop Registration",
    price: "150 SAR",
    date: "2025-10-15",
    message: "Thank you for joining our weekend pottery workshop! The workshop will focus on glazing and shaping techniques. All materials will be provided. Please bring your creativity and enthusiasm!",
  };

  const handleViewContract = (request) => {
    setSelectedContract({
      ...contractData,
      artisan: request.artisan,
      type: request.type,
      date: "2025-10-15"
    });
    setSelectedRequestId(request.id);
    setShowContractModal(true);
  };

  const handleCancelOrder = () => {
    if (selectedRequestId) {
      setRequests(prev => 
        prev.map(req => 
          req.id === selectedRequestId 
            ? { ...req, status: "canceled" }
            : req
        )
      );
      setShowContractModal(false);
      setSelectedRequestId(null);
      setSelectedContract(null);
    }
  };

  const handleAcceptContract = () => {
    if (selectedRequestId) {
      setRequests(prev => 
        prev.map(req => 
          req.id === selectedRequestId 
            ? { ...req, status: "in progress" }
            : req
        )
      );
      setShowContractModal(false);
      setSelectedRequestId(null);
      setSelectedContract(null);
    }
  };

  return (
    <div className="requests-page" style={{ backgroundColor: "#f5f5ee" }}>
      {/* ===== Navbar ===== */}
      <Navbar />

      {/* ===== Header ===== */}
      <section className="container py-5 mt-5">
        <h6
          className="fw-bold mb-2"
          style={{
            color: "#3a0b0b",
            fontSize: "1.2rem",
            letterSpacing: "0.3px",
          }}
        >
          Welcome back, Fatima
        </h6>
        <p
          className="small mb-0"
          style={{
            color: "#5c4b45",
            lineHeight: "1.8",
            maxWidth: "480px",
            fontSize: "0.95rem",
          }}
        >
          Track your sent requests, check artisan responses, and follow up on
          your workshop or order status.
        </p>
      </section>

      {/* ===== Divider ===== */}
      <div
        className="container"
        style={{
          borderBottom: "1px solid #cbbeb3",
          opacity: "0.5",
          marginBottom: "2rem",
        }}
      ></div>

      {/* ===== Filters ===== */}
      <section className="container text-center mb-4">
        <div className="d-flex flex-wrap justify-content-center gap-3">
          {["all", "pending", "approved", "in progress", "completed", "rejected", "canceled"].map(
            (state) => (
              <button
                key={state}
                className={`btn ${
                  filter === state ? "btn-dark" : "btn-outline-dark"
                }`}
                onClick={() => setFilter(state)}
                style={{
                  borderRadius: "20px",
                  padding: "6px 16px",
                  fontSize: "0.9rem",
                  borderColor: "#3a0b0b",
                  color: filter === state ? "#fff" : "#3a0b0b",
                  backgroundColor:
                    filter === state ? "#3a0b0b" : "transparent",
                }}
              >
                {state.charAt(0).toUpperCase() + state.slice(1)}{" "}
                <span style={{ opacity: 0.7 }}>({getCount(state)})</span>
              </button>
            )
          )}
        </div>
      </section>

      {/* ===== Requests List ===== */}
      <section className="container py-5 text-center">
        <h5
          className="fw-bold mb-5"
          style={{
            color: "#3a0b0b",
            fontSize: "1.25rem",
            letterSpacing: "0.5px",
          }}
        >
          Your Sent Requests
          <div
            style={{
              width: "50px",
              height: "2px",
              backgroundColor: "#cbbeb3",
              margin: "10px auto 0",
              opacity: "0.8",
            }}
          ></div>
        </h5>

        {/* Empty State */}
        {filteredRequests.length === 0 && (
          <p className="text-muted mt-4">
            {filter === "all" && "No requests yet. You'll see new ones here once you contact artisans."}
            {filter === "pending" && "No pending requests. Your requests will appear here once sent."}
            {filter === "approved" && "No approved requests. Artisan-approved requests will appear here."}
            {filter === "in progress" && "No requests in progress. Accepted contracts will appear here."}
            {filter === "completed" && "No completed requests yet. Finished projects will appear here."}
            {filter === "rejected" && "No rejected requests. Artisan-rejected requests will appear here."}
            {filter === "canceled" && "No canceled orders. Orders you cancel will appear here."}
          </p>
        )}

        <div className="row justify-content-center">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="col-12 col-sm-10 col-md-8 mb-4 d-flex justify-content-center"
            >
              {/* ===== Card ===== */}
              <div
                className="d-flex flex-column border rounded-3 p-4 bg-white shadow-sm w-100"
                style={{
                  backgroundColor: "#f9f8f4",
                  borderColor: "#eee",
                  transition: "all 0.3s ease",
                }}
              >
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <h6
                      className="fw-semibold mb-1"
                      style={{
                        color: "#3a0b0b",
                        fontSize: "1rem",
                        letterSpacing: "0.3px",
                      }}
                    >
                      {req.type}
                    </h6>
                    <small
                      className="text-muted"
                      style={{ fontSize: "0.9rem" }}
                    >
                      Artisan: {req.artisan}
                    </small>
                  </div>
                  <small
                    className="text-muted"
                    style={{ fontSize: "0.9rem" }}
                  >
                    {req.date}
                  </small>
                </div>

                {/* Message */}
                <p
                  className="small mb-3 text-start"
                  style={{
                    color: "#5c4b45",
                    lineHeight: "1.7",
                    fontSize: "0.95rem",
                  }}
                >
                  {req.message}
                </p>

                {/* Status */}
                <div className="d-flex flex-column gap-3">
                {/* Status badges - Now on its own line */}
                <div className="d-flex gap-2 flex-wrap justify-content-start">
                    {["pending", "approved", "in progress", "completed",  "rejected", "canceled"].map(
                      (status) => (
                        <span
                          key={status}
                          className="px-3 py-1 border rounded-pill small fw-medium"
                          style={{
                            color:
                              req.status === status
                                ? getStatusColor(status)
                                : "#6c757d",
                            borderColor:
                              req.status === status
                                ? getStatusColor(status)
                                : "#dee2e6",
                            backgroundColor:
                              req.status === status
                                ? "rgba(0,0,0,0.03)"
                                : "transparent",
                          }}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      )
                    )}
                  </div>

                  {/* Actions for client */}
                  <div className="d-flex justify-content-end">
                  {req.status === "approved" && (
                    <button
                      className="btn"
                      onClick={() => handleViewContract(req)}
                      style={{
                        border: "1px solid #3a0b0b",
                        color: "#3a0b0b",
                        borderRadius: "20px",
                        padding: "4px 12px",
                        fontSize: "0.85rem",
                      }}
                    >
                      View Contract
                    </button>
                  )}

                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Footer ===== */}
      <Footer />

      {/* ===== Contract Modal ===== */}
      {showContractModal && selectedContract && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content shadow"
              style={{
                borderRadius: "12px",
                border: "none"
              }}
            >
              {/* Modal Header */}
              <div
                className="modal-header border-0"
                style={{
                  backgroundColor: "#f5f5ee",
                  borderTopLeftRadius: "12px",
                  borderTopRightRadius: "12px"
                }}
              >
                <h5
                  className="modal-title fw-bold"
                  style={{ color: "#3a0b0b", fontSize: "1.5rem" }}
                >
                  Contract Details
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowContractModal(false)}
                  aria-label="Close"
                ></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body p-4">
                {/* Artisan Field */}
                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ color: "#3a0b0b" }}>
                    Artisan
                  </label>
                  <div
                    className="form-control"
                    style={{
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #dee2e6",
                      borderRadius: "8px",
                      color: "#4a4a4a"
                    }}
                  >
                    {selectedContract.artisan}
                  </div>
                </div>

                {/* Service Type */}
                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ color: "#3a0b0b" }}>
                    Service Type
                  </label>
                  <div
                    className="form-control"
                    style={{
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #dee2e6",
                      borderRadius: "8px",
                      color: "#4a4a4a"
                    }}
                  >
                    {selectedContract.type}
                  </div>
                </div>

                {/* Price Field */}
                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ color: "#3a0b0b" }}>
                    Price
                  </label>
                  <div
                    className="form-control fw-bold"
                    style={{
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #dee2e6",
                      borderRadius: "8px",
                      color: "#3a0b0b",
                      fontSize: "1.1rem"
                    }}
                  >
                    {selectedContract.price}
                  </div>
                </div>

                {/* Message Field */}
                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ color: "#3a0b0b" }}>
                    Artisan's Message
                  </label>
                  <div
                    className="form-control"
                    style={{
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #dee2e6",
                      borderRadius: "8px",
                      color: "#4a4a4a",
                      minHeight: "120px",
                      padding: "12px"
                    }}
                  >
                    {selectedContract.message}
                  </div>
                </div>

                {/* Date Field - From Send Contract Form */}
                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ color: "#3a0b0b" }}>
                    Completion Date
                  </label>
                  <div
                    className="form-control"
                    style={{
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #dee2e6",
                      borderRadius: "8px",
                      color: "#4a4a4a"
                    }}
                  >
                    {selectedContract.date ? new Date(selectedContract.date).toLocaleDateString('en-CA') : "To be determined"}
                  </div>
                  <div className="form-text" style={{ color: "#6c757d" }}>
                    Expected completion date for this project
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex justify-content-end gap-3 pt-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4 py-2 fw-semibold"
                    onClick={handleCancelOrder}
                    style={{
                      borderRadius: "8px",
                      borderColor: "#a13a3a",
                      color: "#a13a3a",
                      minWidth: "120px"
                    }}
                  >
                    Cancel Order
                  </button>
                  <button
                    type="button"
                    className="btn px-4 py-2 fw-semibold"
                    onClick={handleAcceptContract}
                    style={{
                      backgroundColor: "#3a0b0b",
                      color: "#f5f5ee",
                      borderRadius: "8px",
                      minWidth: "140px"
                    }}
                  >
                    Accept Contract
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}