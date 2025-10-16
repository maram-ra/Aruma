import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import WorkGallery from "../../components/WorkGallery";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

function RequestModal({ show, onClose, artisanName = "sara" }) {
  const [formData, setFormData] = useState({
    type: "",
    message: "",
    date: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.type) {
      alert("Please choose the type of service");
      return;
    }

    console.log("Sending request:", { artisan: artisanName, ...formData });
    alert(`Request for ${formData.type} sent successfully to ${artisanName}!`);

    onClose();
    setFormData({ type: "", message: "", date: "" });
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content border-0 shadow"
          style={{
            backgroundColor: "#f5f5ee",
            borderRadius: "16px",
            padding: "2rem 1.5rem",
          }}
        >
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold m-0" style={{ color: "#3a0b0b", fontSize: "1.4rem" }}>
              Send Request
            </h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit}>
            {/* Artisan Info */}
            <div className="mb-4">
              <label className="form-label fw-semibold small" style={{ color: "#3a0b0b" }}>
                Artisan
              </label>
              <div
                className="form-control-plaintext ps-2"
                style={{
                  backgroundColor: "#eeeae3",
                  borderRadius: "8px",
                  color: "#3a0b0b",
                  padding: "10px 14px",
                }}
              >
                {artisanName}
              </div>
            </div>

            {/* Service Type */}
            <div className="mb-4">
              <label className="form-label fw-semibold small" style={{ color: "#3a0b0b" }}>
                Type of Service <span className="text-danger">*</span>
              </label>
              <select
                name="type"
                className="form-select"
                value={formData.type}
                onChange={handleChange}
                required
                style={{
                  borderRadius: "8px",
                  borderColor: "#cbbeb3",
                  color: formData.type ? "#3a0b0b" : "#6c757d",
                  backgroundColor: "#fff",
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

            {/* Message */}
            <div className="mb-4">
              <label className="form-label fw-semibold small" style={{ color: "#3a0b0b" }}>
                Message <span className="text-danger">*</span>
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
                  borderColor: "#cbbeb3",
                  backgroundColor: "#fff",
                  resize: "vertical",
                  color: "#3a0b0b",
                }}
              ></textarea>
              <div className="form-text mt-1" style={{ color: "#6c757d", fontSize: "0.85rem" }}>
                Be specific — this helps the artisan understand your needs better.
              </div>
            </div>

            {/* Date */}
            <div className="mb-4">
              <label className="form-label fw-semibold small" style={{ color: "#3a0b0b" }}>
                Preferred Date <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                name="date"
                className="form-control"
                value={formData.date}
                onChange={handleChange}
                required
                style={{
                  borderRadius: "8px",
                  borderColor: "#cbbeb3",
                  color: "#3a0b0b",
                }}
              />
              <div className="form-text mt-1" style={{ color: "#6c757d", fontSize: "0.85rem" }}>
                {formData.type
                  ? `Choose a date for your ${formData.type.toLowerCase()} request`
                  : "Select a date for your request"}
              </div>
            </div>

            {/* Buttons */}
            <div className="d-flex justify-content-end gap-3 pt-3">
              <button type="button" className="btn-outline btn-small" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-main btn-small">
                Send Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ArtisanProfile() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="artisan-profile" style={{ backgroundColor: "#f5f5ee" }}>
      <Navbar />

      {/* Profile Section */}
      <section className="container py-5 mt-5">
        <div className="row align-items-center justify-content-between">
          <div
            className="col-md-8 d-flex align-items-center flex-wrap flex-md-nowrap text-md-start text-center"
            style={{ gap: "1.5rem" }}
          >
            <div
              className="rounded-circle flex-shrink-0"
              style={{
                width: "90px",
                height: "90px",
                border: "1px solid #d3d3d3",
                backgroundColor: "#e7e7e7",
              }}
            ></div>

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
                {["Products", "Workshops", "Live Show"].map((service, i) => (
                  <span
                    key={i}
                    className="badge small fw-normal me-2"
                    style={{
                      backgroundColor: "#e3e4e1",
                      color: "#3a0b0b",
                    }}
                  >
                    {service}
                  </span>
                ))}
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

          <div className="col-md-4 mt-4 mt-md-0 d-flex justify-content-md-end justify-content-center">
            <button className="btn-outline" onClick={() => setShowModal(true)}>
              Send Request
            </button>
          </div>
        </div>
      </section>

      <div
        className="container"
        style={{
          borderBottom: "1px solid #cbbeb3",
          opacity: "0.5",
          marginBottom: "2rem",
        }}
      ></div>

      <section className="container text-center py-5">
        <WorkGallery />
      </section>

      <Footer />

      <RequestModal show={showModal} onClose={() => setShowModal(false)} artisanName="sara" />
    </div>
  );
}
