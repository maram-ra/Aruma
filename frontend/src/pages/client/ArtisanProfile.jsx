import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { alertSuccess, alertError, alertInfo, alertConfirm } from "../../components/ArumaAlert";

/* ======================= Request Modal ======================= */
function RequestModal({ show, onClose, artisan }) {
  const [formData, setFormData] = useState({ type: "", message: "" });
  const token = localStorage.getItem("token");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.type) {
      await alertInfo("Please select a service type.", { title: "Missing Field" });
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          artisanId: artisan._id || artisan.id,
          requestType: formData.type,
          message: formData.message,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        await alertSuccess(`Request sent successfully to ${artisan.name}!`, { confirmText: "Great" });
        onClose();
        setFormData({ type: "", message: "" });
      } else {
        await alertError(data.detail || "Failed to send request");
      }
    } catch {
      await alertError("Network error.\nPlease try again later.");
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block modal-overlay" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content border-0 shadow responsive-modal"
          style={{ backgroundColor: "#f5f5ee", borderRadius: "16px", padding: "2rem 1.5rem" }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold m-0" style={{ color: "#3a0b0b" }}>Send Request</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3 text-start">
              <label className="form-label fw-semibold small" style={{ color: "#3a0b0b" }}>
                Type of Service <span className="text-danger">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="form-select"
                style={{ borderRadius: "8px", borderColor: "#cbbeb3" }}
              >
                <option value="">Select type</option>
                <option value="product">Product</option>
                <option value="workshop">Workshop</option>
                <option value="live_show">Live Show</option>
              </select>
            </div>

            <div className="mb-4 text-start">
              <label className="form-label fw-semibold small" style={{ color: "#3a0b0b" }}>
                Message <span className="text-danger">*</span>
              </label>
              <textarea
                name="message"
                rows="3"
                placeholder="Write a short description of your request..."
                value={formData.message}
                onChange={handleChange}
                required
                className="form-control"
                style={{ borderRadius: "8px", borderColor: "#cbbeb3" }}
              />
            </div>

            <div className="d-flex justify-content-end gap-3">
              <button
                type="button"
                className="btn-outline"
                onClick={async () => {
                  const ok = await alertConfirm("Cancel this action?", {
                    title: "Confirm",
                    confirmText: "Yes",
                    cancelText: "No",
                  });
                  if (ok) onClose();
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn-main">Send Request</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ======================= Main Artisan Profile ======================= */
export default function ArtisanProfile() {
  const [searchParams] = useSearchParams();
  const [artisan, setArtisan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const artisanId = searchParams.get("id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchArtisan = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/v1/artisans/${artisanId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setArtisan(await res.json());
        else await alertError("Failed to load artisan details.");
      } catch (error) {
        console.error("Error fetching artisan:", error);
        await alertError("Network error while loading artisan.");
      }
    };
    if (artisanId) fetchArtisan();
  }, [artisanId, token]);

  if (!artisan)
    return (
      <div className="text-center py-5">
        <p>Loading artisan details...</p>
      </div>
    );

  return (
    <div className="artisan-profile">
      <Navbar />

      {/* ===== Header (Profile Info) ===== */}
      <section className="container py-5 mt-5">
        <div className="row align-items-center justify-content-between">
          {/* الصورة فوق الاسم على الجوال — أفقي على الديسكتوب */}
          <div
            className="col-md-8 d-flex align-items-center flex-column flex-md-row text-md-start text-center"
            style={{ gap: "1.5rem" }}
          >
            <img
              src={artisan.images?.[0] || "/images/default_profile.png"}
              alt="Profile"
              className="rounded-circle profile-avatar mb-3 mb-md-0"
              style={{
                width: "90px",
                height: "90px",
                objectFit: "cover",
                border: "1px solid #d3d3d3",
                backgroundColor: "#e7e7e7",
              }}
            />

            <div className="w-100">
              <div className="d-flex align-items-center flex-wrap gap-2 mb-2 justify-content-md-start justify-content-center">
                <h6
                  className="fw-bold mb-0 text-lowercase profile-name"
                  style={{ color: "#3a0b0b", fontSize: "1.15rem", letterSpacing: "0.3px" }}
                >
                  {artisan.name}
                </h6>
              </div>

              <p className="services-list mb-2 d-flex flex-wrap gap-2 justify-content-md-start justify-content-center">
                {artisan.offersProduct && <span className="service-badge">Products</span>}
                {artisan.offersWorkshop && <span className="service-badge">Workshops</span>}
                {artisan.offersLiveShow && <span className="service-badge">Live Show</span>}
              </p>

              <p
                className="small mb-0 profile-bio text-md-start text-center"
                style={{ color: "#6f4e37", lineHeight: "1.8", maxWidth: "420px", fontSize: "0.95rem", marginTop: "8px" }}
              >
                {artisan.bio && artisan.bio.trim() !== ""
                  ? artisan.bio
                  : "No bio yet — every craft tells a story waiting to be shared."}
              </p>
            </div>
          </div>

          <div className="col-md-4 mt-4 mt-md-0 d-flex justify-content-md-end justify-content-center">
            <button className="btn-outline" onClick={() => setShowModal(true)}>Send Request</button>
          </div>
        </div>
      </section>

      <div className="container" style={{ borderBottom: "1px solid #cbbeb3", opacity: "0.5", marginBottom: "2rem" }} />

      {/* ===== Gallery ===== */}
      <section className="container py-5 text-center">
        <h5 className="fw-bold mb-5" style={{ color: "#3a0b0b", fontSize: "1.25rem", letterSpacing: "0.5px" }}>
          My Work
          <div style={{ width: "50px", height: "2px", backgroundColor: "#cbbeb3", margin: "10px auto 0", opacity: "0.8" }} />
        </h5>

        {Array.isArray(artisan.images) && artisan.images.slice(1).filter(Boolean).length ? (
          <div className="row justify-content-center g-4 g-md-5">
            {artisan.images.slice(1).filter(Boolean).map((img, i) => (
              <div key={i} className="col-12 col-sm-6 col-md-4 d-flex flex-column align-items-center">
                <div className="overflow-hidden work-card shadow-sm" style={{ borderRadius: "10px", boxShadow: "0 3px 10px rgba(0,0,0,0.08)" }}>
                  <img
                    src={img}
                    alt={`Work ${i + 1}`}
                    className="work-img"
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: "100%",
                      maxWidth: "340px",  // Desktop baseline
                      height: "420px",    // Desktop baseline
                      objectFit: "cover",
                      display: "block",
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
          <p className="text-muted">No work images uploaded yet.</p>
        )}
      </section>

      <Footer />

      <RequestModal show={showModal} onClose={() => setShowModal(false)} artisan={artisan} />

      {/* ===== Responsive styles (desktop unchanged) ===== */}
      <style>{`
        /* Desktop: نحافظ على الشكل الحالي */
        @media (min-width: 992px){
          .profile-bio{ max-width: 66ch !important; text-wrap: pretty; }
          .profile-name{ margin-bottom: .25rem !important; }
        }

        /* تابلت وما دون (≤ 991.98px) */
        @media (max-width: 991.98px){
          .profile-avatar{ width: 80px !important; height: 80px !important; }

          .profile-bio{
            max-width: 60ch !important;
            font-size: clamp(.9rem, 1.8vw, .95rem) !important;
            padding-inline: 6px;
            text-wrap: balance;
          }

          /* القالري: اعتماد نسبة أبعاد للكروت */
          .work-card{
            width: min(100%, 360px);
            aspect-ratio: 4 / 5;
          }
          .work-img{
            width: 100% !important;
            height: 100% !important;
            max-width: none !important;
            object-fit: cover;
          }
        }

        /* جوال صغير (≤ 575.98px) */
        @media (max-width: 575.98px){
          .profile-avatar{ width: 72px !important; height: 72px !important; }
          .work-card{ width: 100%; }
          /* المودال فل-سكرين عملي */
          .responsive-modal{
            width: 100% !important;
            max-width: none !important;
            height: auto;
            margin: 0;
            border-radius: 0 !important;
          }
        }

        /* احترام تقليل الحركة */
        @media (prefers-reduced-motion: reduce){
          * { transition: none !important; animation: none !important; }
        }
      `}</style>
    </div>
  );
}
