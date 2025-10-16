import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import WorkGallery from "../../components/WorkGallery";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

/* ========== Edit Account Modal ========== */
function EditAccountModal({ show, onClose }) {
  const [formData, setFormData] = useState({
    name: "sara",
    craftType: "Pottery",
    bio: "",
    services: "Workshops",
  });

  if (!show) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Changes saved successfully!");
    onClose();
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
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
            <h5 className="fw-bold m-0" style={{ color: "#3a0b0b" }}>
              Edit Account
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold small" style={{ color: "#3a0b0b" }}>
                Name
              </label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                style={{ borderRadius: "8px", borderColor: "#cbbeb3" }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold small" style={{ color: "#3a0b0b" }}>
                Craft Type
              </label>
              <select
                name="craftType"
                className="form-select"
                value={formData.craftType}
                onChange={handleChange}
                style={{ borderRadius: "8px", borderColor: "#cbbeb3" }}
              >
                <option>Pottery</option>
                <option>Jewelry</option>
                <option>Woodwork</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold small" style={{ color: "#3a0b0b" }}>
                Bio
              </label>
              <textarea
                name="bio"
                className="form-control"
                placeholder="Short description about your craft"
                rows="3"
                value={formData.bio}
                onChange={handleChange}
                style={{ borderRadius: "8px", borderColor: "#cbbeb3" }}
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold small" style={{ color: "#3a0b0b" }}>
                Services Offered
              </label>
              <select
                name="services"
                className="form-select"
                value={formData.services}
                onChange={handleChange}
                style={{ borderRadius: "8px", borderColor: "#cbbeb3" }}
              >
                <option>Products</option>
                <option>Workshops</option>
                <option>Live Show</option>
              </select>
            </div>

            <div className="d-flex justify-content-end gap-3">
              <button type="button" className="btn-outline" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-main">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ========== Main Profile Page ========== */
export default function Profile() {
  const [showEdit, setShowEdit] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="artisan-profile" style={{ backgroundColor: "#f5f5ee" }}>
      <Navbar />

      {/* ===== Profile Section ===== */}
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

          {/* ===== Buttons ===== */}
          <div className="col-md-4 mt-4 mt-md-0 d-flex gap-3 justify-content-md-end justify-content-center">
            <button className="btn-outline" onClick={() => navigate("/artisan/Requests_A")}>
              View Requests
            </button>
            <button className="btn-outline" onClick={() => setShowEdit(true)}>
              Edit Account
            </button>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div
        className="container"
        style={{
          borderBottom: "1px solid #cbbeb3",
          opacity: "0.5",
          marginBottom: "2rem",
        }}
      ></div>

      {/* ===== Work Gallery ===== */}
      <section className="container text-center py-5">
        <WorkGallery />
      </section>

      <Footer />

      {/* ===== Modals ===== */}
      <EditAccountModal show={showEdit} onClose={() => setShowEdit(false)} />
    </div>
  );
}
