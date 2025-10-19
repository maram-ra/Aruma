import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

/* =======================
   Edit Account Modal
   ======================= */
function EditAccountModal({ show, onClose, artisan, setArtisan }) {
  const [formData, setFormData] = useState({
    name: artisan?.name || "",
    craftType: artisan?.craftType || "",
    bio: artisan?.bio || "",
    offersWorkshop: artisan?.offersWorkshop || false,
    offersLiveShow: artisan?.offersLiveShow || false,
    profileImage: artisan?.images?.[0] || "",
    gallery: artisan?.images?.slice(1) || [],
  });

  // Update form when artisan data changes
  useEffect(() => {
    if (artisan) {
      setFormData({
        name: artisan.name,
        craftType: artisan.craftType,
        bio: artisan.bio || "",
        offersWorkshop: artisan.offersWorkshop || false,
        offersLiveShow: artisan.offersLiveShow || false,
        profileImage: artisan.images?.[0] || "",
        gallery: artisan.images?.slice(1) || [],
      });
    }
  }, [artisan]);

  if (!show) return null;

  // Handle text and checkbox input changes
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle profile and gallery image uploads
const handleImageUpload = async (e, type) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://127.0.0.1:8000/api/v1/upload/image", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      if (type === "profile") {
        setFormData((prev) => ({ ...prev, profileImage: data.url }));
      } else {
        setFormData((prev) => ({
          ...prev,
          gallery: [...prev.gallery, data.url],
        }));
      }
    } else {
      console.error("Upload failed:", data);
      alert("Image upload failed.");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    alert("Network error while uploading image.");
  }
};


  // Submit updated artisan profile to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const artisanId = localStorage.getItem("userId");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/artisans/${artisanId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bio: formData.bio,
            craftType: formData.craftType,
            offersWorkshop: formData.offersWorkshop,
            offersLiveShow: formData.offersLiveShow,
            images: [formData.profileImage, ...formData.gallery],
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Profile updated successfully!");
        setArtisan({ ...artisan, ...data });
        onClose();
      } else {
        alert(data.detail || "Update failed");
      }
    } catch (error) {
      console.error("Error updating artisan:", error);
      alert("Network error");
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div
          className="modal-content border-0 shadow"
          style={{
            backgroundColor: "#f5f5ee",
            borderRadius: "16px",
            padding: "2rem 1.5rem",
          }}
        >
          {/* ===== Modal Header ===== */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold m-0" style={{ color: "#3a0b0b" }}>
              Edit Account
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          {/* ===== Form Body ===== */}
          <form onSubmit={handleSubmit}>
            {/* --- Name (disabled) --- */}
            <div className="mb-3">
              <label className="form-label fw-semibold small" style={{ color: "#3a0b0b" }}>
                Name
              </label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                disabled
                style={{ borderRadius: "8px", borderColor: "#cbbeb3" }}
              />
            </div>

            {/* --- Craft Type Dropdown --- */}
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
                <option>Painting</option>
                <option>Textiles</option>
                <option>Leatherwork</option>
              </select>
            </div>

            {/* --- Bio Section --- */}
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

            {/* --- Services Offered Checkboxes --- */}
            <div className="mb-4">
              <label className="form-label fw-semibold small" style={{ color: "#3a0b0b" }}>
                Services Offered
              </label>
              <div className="d-flex flex-column">
                <label className="small text-dark">
                  <input
                    type="checkbox"
                    name="offersWorkshop"
                    checked={formData.offersWorkshop}
                    onChange={handleChange}
                    className="me-2"
                  />
                  Workshops
                </label>
                <label className="small text-dark">
                  <input
                    type="checkbox"
                    name="offersLiveShow"
                    checked={formData.offersLiveShow}
                    onChange={handleChange}
                    className="me-2"
                  />
                  Live Shows
                </label>
              </div>
            </div>

            {/* --- Profile Image Upload --- */}
            <div className="mb-4">
              <label className="form-label fw-semibold small" style={{ color: "#3a0b0b" }}>
                Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "profile")}
                className="form-control"
              />
              {formData.profileImage && (
                <img
                  src={formData.profileImage}
                  alt="Profile"
                  className="mt-2 rounded-circle"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
              )}
            </div>

            {/* --- Work Gallery Upload --- */}
            <div className="mb-4">
              <label className="form-label fw-semibold small" style={{ color: "#3a0b0b" }}>
                Work Gallery
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "gallery")}
                className="form-control"
              />
              <div className="d-flex flex-wrap mt-2" style={{ gap: "10px" }}>
                {formData.gallery.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Gallery ${i}`}
                    style={{
                      width: "90px",
                      height: "90px",
                      borderRadius: "8px",
                      objectFit: "cover",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* --- Action Buttons --- */}
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

/* =======================
   Main Artisan Profile Page
   ======================= */
export default function Profile() {
  const [showEdit, setShowEdit] = useState(false);
  const [artisan, setArtisan] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const artisanId = localStorage.getItem("userId");

  // Fetch artisan data from backend
  useEffect(() => {
    const fetchArtisan = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/v1/artisans/${artisanId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          console.error("Failed to load artisan data");
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

  // Loading state
  if (!artisan) {
    return (
      <div className="text-center py-5">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="artisan-profile" style={{ backgroundColor: "#f5f5ee" }}>
      <Navbar />

      {/* ===== Header Section (Profile Info) ===== */}
      <section className="container py-5 mt-5">
        <div className="row align-items-center justify-content-between">
          {/* Left Side: Profile Image + Info */}
          <div
            className="col-md-8 d-flex align-items-center flex-wrap flex-md-nowrap text-md-start text-center"
            style={{ gap: "1.5rem" }}
          >
            <img
              src={artisan.images?.[0] || "/images/default_profile.png"}
              alt="Profile"
              className="rounded-circle"
              style={{
                width: "90px",
                height: "90px",
                objectFit: "cover",
                border: "1px solid #d3d3d3",
                backgroundColor: "#e7e7e7",
              }}
            />

            <div>
              <h6 className="fw-bold mb-2 text-lowercase" style={{ color: "#3a0b0b" }}>
                {artisan.name}
              </h6>

              {/* Services Badges */}
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
                  {artisan.craftType}
                </span>
              </p>

              {/* Bio Text */}
              <p className="small mb-0" style={{ color: "#5c4b45", lineHeight: "1.8" }}>
                {artisan.bio || "This artisan hasn’t added a bio yet."}
              </p>
            </div>
          </div>

          {/* Right Side: Buttons */}
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

      {/* ===== Divider Line ===== */}
      <div
        className="container"
        style={{ borderBottom: "1px solid #cbbeb3", opacity: "0.5", marginBottom: "2rem" }}
      ></div>

      {/* ===== My Work Section (Gallery with hover effect) ===== */}
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

        {artisan.images?.slice(1)?.length ? (
          <div className="row justify-content-center" style={{ rowGap: "60px" }}>
            {artisan.images.slice(1).map((img, i) => (
              <div
                key={i}
                className="col-12 col-sm-6 col-md-4 d-flex flex-column align-items-center"
                style={{
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                {/* Image container */}
                <div
                  className="overflow-hidden"
                  style={{
                    borderRadius: "10px",
                    boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <img
                    src={img}
                    alt={`Work ${i + 1}`}
                    style={{
                      width: "100%",
                      maxWidth: "340px",
                      height: "420px",
                      objectFit: "cover",
                      transition: "transform 0.4s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                </div>

                {/* Text below image */}
                <h6
                  className="fw-semibold mt-3 mb-1"
                  style={{
                    color: "#3a0b0b",
                    fontSize: "1rem",
                    transition: "color 0.2s ease",
                  }}
                >
                  Artwork {i + 1}
                </h6>
                <p
                  className="text-muted mb-0"
                  style={{
                    fontSize: "0.9rem",
                    maxWidth: "300px",
                    lineHeight: "1.6",
                    color: "#6f4e37",
                  }}
                >
                  Handcrafted piece reflecting artisan’s creativity and skill.
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No work images uploaded yet.</p>
        )}
      </section>

      {/* ===== Footer ===== */}
      <Footer />

      {/* ===== Edit Modal Component ===== */}
      <EditAccountModal
        show={showEdit}
        onClose={() => setShowEdit(false)}
        artisan={artisan}
        setArtisan={setArtisan}
      />
    </div>
  );
}
