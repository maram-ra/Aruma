import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import WorkGallery from "../../components/WorkGallery";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

function RequestModal({ show, onClose, artisanName = "sara" }) {
  const [formData, setFormData] = useState({
    type: "",
    message: "",
    date: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if type is selected
    if (!formData.type) {
      alert("Please choose the type of service");
      return;
    }
    
    console.log("Sending request:", {
      artisan: artisanName,
      ...formData
    });
    
    // Here you would typically send the data to your backend
    alert(`Request for ${formData.type} sent successfully to ${artisanName}!`);
    onClose();
    setFormData({ type: "", message: "", date: "" }); // Reset form
  };

  const handleClose = () => {
    setFormData({ type: "", message: "", date: "" }); // Reset form
    onClose();
  };

  if (!show) return null;

  return (
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
              New Request
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body p-4">
            {/* Artisan and Type Info */}
            <div className="row mb-4">
              <div className="col-6">
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
                  {artisanName}
                </div>
              </div>
              <div className="col-6">
                <label className="form-label fw-semibold" style={{ color: "#3a0b0b" }}>
                  Type *
                </label>
                <select
                  name="type"
                  className="form-select"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  style={{ 
                    borderRadius: "8px",
                    color: formData.type ? "#000" : "#6c757d" // Different color for placeholder
                  }}
                >
                  <option value="" disabled>
                    Choose service type
                  </option>
                  <option value="Workshop">Workshop</option>
                  <option value="Products">Products</option>
                  <option value="Live Show">Live Show</option>
                </select>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Message Textarea */}
              <div className="mb-4">
                <label className="form-label fw-semibold" style={{ color: "#3a0b0b" }}>
                  Message *
                </label>
                <textarea
                  name="message"
                  className="form-control"
                  placeholder="Please describe what you need..."
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  style={{
                    borderRadius: "8px",
                    resize: "vertical"
                  }}
                ></textarea>
              </div>

              {/* Date Input */}
              <div className="mb-4">
                <label className="form-label fw-semibold" style={{ color: "#3a0b0b" }}>
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  className="form-control"
                  placeholder="MM/DD/YYYY"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  style={{ borderRadius: "8px" }}
                />
                <div className="form-text" style={{ color: "#6c757d" }}>
                  {formData.type 
                    ? `Please select your preferred date for the ${formData.type.toLowerCase()}`
                    : "Please select your preferred date"
                  }
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex justify-content-end gap-3 pt-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4 py-2 fw-semibold"
                  onClick={handleClose}
                  style={{
                    borderRadius: "8px",
                    borderColor: "#3a0b0b",
                    color: "#3a0b0b",
                    minWidth: "100px"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn px-4 py-2 fw-semibold"
                  style={{
                    backgroundColor: "#3a0b0b",
                    color: "#f5f5ee",
                    borderRadius: "8px",
                    minWidth: "140px",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#5b2a2a";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#3a0b0b";
                  }}
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ArtisanProfile() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="artisan-profile" style={{ backgroundColor: "#f5f5ee" }}>
      {/* ===== Navbar ===== */}
      <Navbar />

      {/* ===== Profile Section ===== */}
      <section className="container py-5 mt-5">
        <div className="row align-items-center justify-content-between">
          {/* Left side */}
          <div
            className="col-md-8 d-flex align-items-center flex-wrap flex-md-nowrap text-md-start text-center"
            style={{ gap: "1.5rem" }}
          >
            {/* Avatar */}
            <div
              className="rounded-circle flex-shrink-0"
              style={{
                width: "90px",
                height: "90px",
                border: "1px solid #d3d3d3",
                backgroundColor: "#e7e7e7",
              }}
            ></div>

            {/* Text section */}
            <div>
              <h6
                className="fw-bold mb-2 text-lowercase"
                style={{
                  color: "#3a0b0b",
                  fontSize: "1.1rem",
                  letterSpacing: "0.3px",
                }}
              >
                sara
              </h6>

              <p className="mb-2">
                <span
                  className="badge small fw-normal me-2"
                  style={{
                    backgroundColor: "#e3e4e1",
                    color: "#3a0b0b",
                  }}
                >
                  Products
                </span>
                <span
                  className="badge small fw-normal me-2"
                  style={{
                    backgroundColor: "#e3e4e1",
                    color: "#3a0b0b",
                  }}
                >
                  Workshops
                </span>
                <span
                  className="badge small fw-normal"
                  style={{
                    backgroundColor: "#e3e4e1",
                    color: "#3a0b0b",
                  }}
                >
                  Live Show
                </span>
              </p>

              <p
                className="small mb-0"
                style={{
                  color: "#5c4b45",
                  lineHeight: "1.8",
                  maxWidth: "420px",
                  fontSize: "0.95rem",
                }}
              >
                Crafting unique, handmade jewelry pieces with a sustainable touch
                that blends natural textures with modern design.
              </p>
            </div>
          </div>

          {/* Right side button */}
          <div className="col-md-4 mt-4 mt-md-0 d-flex justify-content-md-end align-items-center justify-content-center">
            <button 
              className="btn-outline"
              onClick={() => setShowModal(true)}
              style={{
                border: "1px solid #3a0b0b",
                color: "#3a0b0b",
                backgroundColor: "transparent",
                padding: "8px 20px",
                borderRadius: "8px",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#3a0b0b";
                e.target.style.color = "#f5f5ee";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#3a0b0b";
              }}
            >
              Send Request
            </button>
          </div>
        </div>
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

      {/* ===== My Work ===== */}
      <section className="container text-center py-5">
        <WorkGallery />
      </section>

      {/* ===== Completed Works ===== */}
      <section className="container py-5 text-center">
        <h5
          className="fw-bold mb-5"
          style={{
            color: "#3a0b0b",
            fontSize: "1.25rem",
            letterSpacing: "0.5px",
            position: "relative",
          }}
        >
          Completed Works
          <div
            style={{
              width: "50px",
              height: "2px",
              backgroundColor: "#cbbeb3",
              margin: "10px auto 0",
            }}
          ></div>
        </h5>

        <div className="row justify-content-center">
          {[
            {
              title: "Necklace Order",
              date: "Completed August 2025",
              icon: "bi-gem",
            },
            {
              title: "Jewelry Workshop",
              date: "Completed July 2025",
              icon: "bi-tools",
            },
            {
              title: "Silver Rings",
              date: "Completed June 2025",
              icon: "bi-brilliance",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="col-12 col-sm-10 col-md-8 mb-4 d-flex justify-content-center"
            >
              <div
                className="d-flex align-items-center justify-content-start border rounded-3 p-4 bg-white shadow-sm w-100"
                style={{
                  backgroundColor: "#f9f8f4",
                  borderColor: "#eee",
                  minHeight: "100px",
                  transition: "all 0.3s ease",
                }}
              >
                {/* Icon */}
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                  style={{
                    width: "55px",
                    height: "55px",
                    backgroundColor: "#eeeae3",
                  }}
                >
                  <i
                    className={`bi ${item.icon}`}
                    style={{ color: "#3a0b0b", fontSize: "1.6rem" }}
                  ></i>
                </div>

                {/* Text */}
                <div className="text-start">
                  <h6
                    className="fw-semibold mb-1"
                    style={{
                      color: "#3a0b0b",
                      fontSize: "1rem",
                      letterSpacing: "0.3px",
                    }}
                  >
                    {item.title}
                  </h6>
                  <small
                    className="text-muted"
                    style={{ fontSize: "0.9rem" }}
                  >
                    {item.date}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Footer ===== */}
      <Footer />

      {/* ===== Request Modal ===== */}
      <RequestModal 
        show={showModal} 
        onClose={() => setShowModal(false)}
        artisanName="sara"
      />
    </div>
  );
}