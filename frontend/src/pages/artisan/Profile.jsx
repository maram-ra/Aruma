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
    offersProduct: artisan?.offersProduct || false,
    profileImage: artisan?.images?.[0] || "",
    gallery: artisan?.images?.slice(1) || [],
  });

  // تحديث بيانات الفورم عند تغيير بيانات الحرفي
  useEffect(() => {
    if (artisan) {
      setFormData({
        name: artisan.name,
        craftType: artisan.craftType,
        bio: artisan.bio || "",
        offersWorkshop: artisan.offersWorkshop || false,
        offersLiveShow: artisan.offersLiveShow || false,
        offersProduct: artisan.offersProduct || false,
        profileImage: artisan.images?.[0] || "",
        gallery: artisan.images?.slice(1) || [],
      });
    }
  }, [artisan]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // رفع الصور (بروفايل أو معرض أعمال)
  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/upload/image", {
        method: "POST",
        body: uploadData,
      });
      const data = await res.json();

      if (res.ok) {
        if (type === "profile") {
          setFormData((prev) => ({ ...prev, profileImage: data.url }));
        } else {
          setFormData((prev) => ({
            ...prev,
            gallery: [...prev.gallery, data.url],
          }));
        }
      } else alert("Upload failed");
    } catch {
      alert("Network error while uploading image");
    }
  };

  // حفظ التغييرات
 const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  const artisanId = localStorage.getItem("userId");

  try {
    const res = await fetch(
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
          offersProduct: formData.offersProduct,
          images: [formData.profileImage, ...formData.gallery],
        }),
      }
    );

    const data = await res.json();

      if (res.ok) {
        alert("Profile updated successfully!");
        setArtisan({ ...artisan, ...data });
        onClose();
      } else alert(data.detail || "Update failed");
    } catch {
      alert("Network error");
    }
  };

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div
          className="modal-content border-0 shadow"
          style={{
            backgroundColor: "#f5f5ee",
            borderRadius: "16px",
            padding: "2rem 1.5rem",
          }}
        >
          {/* ===== Header ===== */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold m-0" style={{ color: "#3a0b0b" }}>
              Edit Account
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          {/* ===== Form ===== */}
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-3">
              <label
                className="form-label fw-semibold small"
                style={{ color: "#3a0b0b" }}
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                disabled
                className="form-control"
                style={{ borderRadius: "8px", borderColor: "#cbbeb3" }}
              />
            </div>

            {/* Bio */}
            <div className="mb-3">
              <label
                className="form-label fw-semibold small"
                style={{ color: "#3a0b0b" }}
              >
                Bio
              </label>
              <textarea
                name="bio"
                rows="3"
                placeholder="Short description about your craft"
                value={formData.bio}
                onChange={handleChange}
                className="form-control"
                style={{ borderRadius: "8px", borderColor: "#cbbeb3" }}
              ></textarea>
            </div>

            {/* Profile Image */}
<div className="mb-4">
 
  <label
    htmlFor="profileUpload"
    className="btn d-inline-flex align-items-center gap-2"
    style={{
      backgroundColor: "#eae4de",
      color: "#3a0b0b",
      borderRadius: "8px",
      padding: "8px 16px",
      cursor: "pointer",
      fontWeight: 500,
    }}
  >
    <i className="bi bi-camera-fill"></i> 
    {formData.profileImage ? "Change Image" : "Upload Image"}
  </label>
  <input
    id="profileUpload"
    type="file"
    accept="image/*"
    onChange={(e) => handleImageUpload(e, "profile")}
    style={{ display: "none" }}
  />

  {formData.profileImage && (
    <>
      <div
        className="mt-2 small text-muted"
        style={{ color: "#6c757d", fontSize: "0.85rem" }}
      >
        {formData.profileImage.split("/").pop()}
      </div>
      <img
        src={formData.profileImage}
        alt="Profile"
        className="mt-2 rounded-circle border"
        style={{
          width: "100px",
          height: "100px",
          objectFit: "cover",
          borderColor: "#cbbeb3",
        }}
      />
    </>
  )}
</div>

{/* Work Gallery */}
<div className="mb-4">
  
  <label
    htmlFor="galleryUpload"
    className="btn d-inline-flex align-items-center gap-2"
    style={{
      backgroundColor: "#eae4de",
      color: "#3a0b0b",
      borderRadius: "8px",
      padding: "8px 16px",
      cursor: "pointer",
      fontWeight: 500,
    }}
  >
    <i className="bi bi-images"></i> {/* ← أيقونة معرض الصور */}
    Add Images
  </label>
  <input
    id="galleryUpload"
    type="file"
    multiple
    accept="image/*"
    onChange={(e) => handleImageUpload(e, "gallery")}
    style={{ display: "none" }}
  />

  <div className="d-flex flex-wrap mt-3" style={{ gap: "10px" }}>
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
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        }}
      />
    ))}
  </div>
</div>


            {/* Buttons */}
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
   Main Profile Page
   ======================= */
export default function Profile() {
  const [showEdit, setShowEdit] = useState(false);
  const [artisan, setArtisan] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const artisanId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchArtisan = async () => {
      const res = await fetch(
        `http://127.0.0.1:8000/api/v1/artisans/${artisanId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) setArtisan(await res.json());
    };
    if (artisanId) fetchArtisan();
  }, [artisanId, token]);

  if (!artisan)
    return (
      <div className="text-center py-5">
        <p>Loading profile...</p>
      </div>
    );

  return (
    <div className="artisan-profile" style={{ backgroundColor: "#f5f5ee" }}>
      <Navbar />

      {/* ===== Profile Info ===== */}
      <section className="container py-5 mt-5">
        <div className="row align-items-center justify-content-between">
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
{/* ===== Profile Info (Name + Craft Type + Services + Bio) ===== */}
<div>
  {/* ===== Name + Craft Type ===== */}
<div className="d-flex align-items-center flex-wrap gap-2 mb-3">
  <h6
    className="fw-bold mb-0 text-lowercase"
    style={{
      color: "#3a0b0b",
      fontSize: "1.15rem",
      letterSpacing: "0.3px",
    }}
  >
    {artisan.name}
  </h6>

</div>


  {/* Services Offered */}
  <p className="mb-2">
    {artisan.offersProduct && (
      <span
        className="badge small fw-normal me-2"
        style={{
          backgroundColor: "#e3e4e1",
          color: "#3a0b0b",
        }}
      >
        Products
      </span>
    )}

    {artisan.offersWorkshop && (
      <span
        className="badge small fw-normal me-2"
        style={{
          backgroundColor: "#e3e4e1",
          color: "#3a0b0b",
        }}
      >
        Workshops
      </span>
    )}

    {artisan.offersLiveShow && (
      <span
        className="badge small fw-normal me-2"
        style={{
          backgroundColor: "#e3e4e1",
          color: "#3a0b0b",
        }}
      >
        Live Show
      </span>
    )}
  </p>

  {/* Bio */}
  <p
    className="small mb-0"
    style={{
      color: "#6f4e37", // لون أدفأ وهادئ
      lineHeight: "1.8",
      maxWidth: "420px",
      fontSize: "0.95rem",
      marginTop: "8px", // تباعد بصري أنيق
    }}
  >
    {artisan.bio && artisan.bio.trim() !== ""
      ? artisan.bio
      : "No bio yet — every craft tells a story waiting to be shared."}
  </p>
</div>

          </div>

          <div className="col-md-4 mt-4 mt-md-0 d-flex gap-3 justify-content-md-end justify-content-center">
            <button
              className="btn-outline"
              onClick={() => navigate("/artisan/Requests_A")}
            >
              View Requests
            </button>
            <button className="btn-outline" onClick={() => setShowEdit(true)}>
              Edit Account
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

      {/* ===== Work Gallery ===== */}
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

        {artisan.images?.slice(1)?.length ? (
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
                    alt={`Work ${i + 1}`}
                    style={{
                      width: "100%",
                      maxWidth: "340px",
                      height: "420px",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <h6 className="fw-semibold mt-3 mb-1" style={{ color: "#3a0b0b" }}>
                  Artwork {i + 1}
                </h6>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No work images uploaded yet.</p>
        )}
      </section>

      <Footer />

      {/* ===== Edit Modal ===== */}
      <EditAccountModal
        show={showEdit}
        onClose={() => setShowEdit(false)}
        artisan={artisan}
        setArtisan={setArtisan}
      />
    </div>
  );
}
