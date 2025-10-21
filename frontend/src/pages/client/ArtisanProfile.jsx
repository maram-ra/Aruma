import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import WorkGallery from "../../components/WorkGallery";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

function RequestModal({ show, onClose, artisan }) {
  const [formData, setFormData] = useState({
    type: "",
    message: "",
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.type) {
      alert("Please select a service type");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          artisanId: artisan._id,
          requestType: formData.type,
          message: formData.message,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(`Request sent successfully to ${artisan.name}!`);
        onClose();
        setFormData({ type: "", message: "" });
      } else {
        alert(data.detail || "Failed to send request");
      }
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Network error");
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content border-0 shadow"
          style={{ backgroundColor: "#f5f5ee", borderRadius: "16px", padding: "2rem 1.5rem" }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold m-0" style={{ color: "#3a0b0b", fontSize: "1.4rem" }}>
              Send Request
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
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
                  color: "#3a0b0b",
                }}
              >
                <option value="" disabled>
                  Choose service type
                </option>
                <option value="workshop">Workshop</option>
                <option value="product">Product</option>
                <option value="live_show">Live Show</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold small" style={{ color: "#3a0b0b" }}>
                Message <span className="text-danger">*</span>
              </label>
              <textarea
                name="message"
                className="form-control"
                placeholder="Describe your request..."
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
                style={{
                  borderRadius: "8px",
                  borderColor: "#cbbeb3",
                  backgroundColor: "#fff",
                  color: "#3a0b0b",
                }}
              ></textarea>
            </div>

            <div className="d-flex justify-content-end gap-3 pt-3">
              <button type="button" className="btn-outline btn-small" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-main btn-small">
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ArtisanProfile() {
  const [searchParams] = useSearchParams();
  const [artisan, setArtisan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");
  const artisanId = searchParams.get("id");
  

  useEffect(() => {
  const fetchArtisan = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/artisans/${artisanId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to load artisan");
        return;
      }

      const data = await response.json();
      setArtisan(data);
    } catch (error) {
      console.error("Error fetching artisan:", error);
    }
  };

  if (artisanId) fetchArtisan();
}, [artisanId, token]);

  if (!artisan) {
    return (
      <div className="text-center py-5">
        <p>Loading artisan details...</p>
      </div>
    );
  }

  return (
    <div className="artisan-profile" style={{ backgroundColor: "#f5f5ee" }}>
      <Navbar />

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
              <h6 className="fw-bold mb-2 text-lowercase" style={{ color: "#3a0b0b" }}>
                {artisan.name}
              </h6>

              <p className="mb-2">
                {artisan.offersWorkshop && (
                  <span className="badge small me-2" style={{ backgroundColor: "#e3e4e1" }}>
                    Workshops
                  </span>
                )}
                {artisan.offersLiveShow && (
                  <span className="badge small me-2" style={{ backgroundColor: "#e3e4e1" }}>
                    Live Show
                  </span>
                )}
                <span className="badge small" style={{ backgroundColor: "#e3e4e1" }}>
                  {artisan.craftType || "Craft"}
                </span>
              </p>

              <p className="small mb-0" style={{ color: "#5c4b45", lineHeight: "1.8" }}>
                {artisan.bio || "This artisan hasn’t added a bio yet."}
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

      <div className="container" style={{ borderBottom: "1px solid #cbbeb3", opacity: "0.5", marginBottom: "2rem" }}></div>

     {/* ===== Work Gallery (Dynamic) ===== */}
<section className="container py-5 text-center">
  <h5
    className="fw-bold mb-5"
    style={{
      color: "#3a0b0b",
      fontSize: "1.25rem",
      letterSpacing: "0.5px",
    }}
  >
    My Work
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

  {artisan.images && artisan.images.length > 1 ? (
    <div className="row justify-content-center" style={{ rowGap: "60px" }}>
      {artisan.images.slice(1).map((img, i) => (
        <div
          key={i}
          className="col-12 col-sm-6 col-md-4 d-flex flex-column align-items-center"
        >
          <div
            className="overflow-hidden"
            style={{
              borderRadius: "10px",
              boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
            }}
          >
            <img
              src={img}
              alt={`Artwork ${i + 1}`}
              style={{
                width: "100%",
                maxWidth: "340px",
                height: "420px",
                objectFit: "cover",
              }}
            />
          </div>
          <h6 className="fw-semibold mt-3 mb-1" style={{ color: "#3a0b0b" }}>
            {artisan.galleryTitles?.[i] || `Artwork ${i + 1}`}
          </h6>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-muted">No work uploaded yet.</p>
  )}
</section>


      <Footer />

      <RequestModal show={showModal} onClose={() => setShowModal(false)} artisan={artisan} />
    </div>
  );
}
