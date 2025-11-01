import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { alertSuccess, alertError, alertConfirm } from "../../components/ArumaAlert";

/* ======================= Edit Account Modal ======================= */
function EditAccountModal({ show, onClose, artisan, setArtisan }) {
  const [formData, setFormData] = useState({
    name: artisan?.name || "",
    craftType: artisan?.craftType || "",
    bio: artisan?.bio || "",
    offersWorkshop: artisan?.offersWorkshop || false,
    offersLiveShow: artisan?.offersLiveShow || false,
    offersProduct: artisan?.offersProduct || false,
    profileImage: artisan?.images?.[0] || "",
    gallery:
      artisan?.gallery ||
      artisan?.images?.slice(1)?.map((url) => ({ url, title: "" })) ||
      [],
  });

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
        gallery:
          artisan.gallery ||
          artisan.images?.slice(1)?.map((url, i) => ({
            url,
            title: artisan.galleryTitles?.[i] || "",
          })) ||
          [],
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
            gallery: [...prev.gallery, { url: data.url, title: "" }],
          }));
        }
        await alertSuccess("Image uploaded successfully!");
      } else {
        await alertError(data.detail || "Upload failed");
      }
    } catch {
      await alertError("Network error while uploading image.");
    }
  };

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
            images: [formData.profileImage, ...formData.gallery.map((g) => g.url)],
            galleryTitles: formData.gallery.map((g) => g.title),
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        await alertSuccess("Profile updated successfully!");
        setArtisan({ ...artisan, ...data });
        onClose();
      } else {
        await alertError(data.detail || "Update failed.");
      }
    } catch {
      await alertError("Network error while saving changes.");
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      {/* على الشاشات الصغيرة يصبح فل سكرين، وعلى الكبيرة يبقى كما هو */}
      <div className="modal-dialog modal-dialog-centered modal-lg modal-fullscreen-sm-down">
        <div
          className="modal-content border-0 shadow"
          style={{
            backgroundColor: "#f5f5ee",
            borderRadius: "16px",
            padding: "2rem 1.5rem",
          }}
        >
          <div className="d-flex justify-content-between align-items-center ">
            <h5 className="fw-bold m-0" style={{ color: "#3a0b0b" }}>
              Edit Account
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={async () => {
                const ok = await alertConfirm("Cancel editing?", {
                  title: "Confirm",
                  confirmText: "Yes",
                  cancelText: "No",
                });
                if (ok) onClose();
              }}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold small" style={{ color: "#3a0b0b" }}>
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

            <div className="mb-3">
              <label className="form-label fw-semibold small" style={{ color: "#3a0b0b" }}>
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
                <img
                  src={formData.profileImage}
                  alt="Profile"
                  className="mt-3 rounded-circle border profile-avatar"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderColor: "#cbbeb3",
                  }}
                />
              )}
            </div>

            {/* Gallery */}
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
                <i className="bi bi-images"></i> Add Images
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
                {formData.gallery.map((item, i) => (
                  <div key={i} className="edit-gallery-item" style={{ width: "120px" }}>
                    <img
                      src={item.url}
                      alt={`Work ${i}`}
                      style={{
                        width: "100%",
                        height: "100px",
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Work title"
                      value={item.title}
                      onChange={(e) =>
                        setFormData((prev) => {
                          const updated = [...prev.gallery];
                          updated[i].title = e.target.value;
                          return { ...prev, gallery: updated };
                        })
                      }
                      className="form-control mt-2"
                      style={{
                        borderRadius: "6px",
                        borderColor: "#cbbeb3",
                        fontSize: "0.8rem",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="d-flex justify-content-end gap-3">
              <button
                type="button"
                className="btn-outline"
                onClick={async () => {
                  const ok = await alertConfirm("Cancel without saving?", {
                    title: "Confirm",
                    confirmText: "Yes",
                    cancelText: "No",
                  });
                  if (ok) onClose();
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn-main">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ===== Responsive-only styles for the modal ===== */}
      <style>{`
        @media (max-width: 575.98px){
          .modal-content{ border-radius: 0 !important; padding: 1.25rem 1rem !important; }
          .profile-avatar{ width: 84px !important; height: 84px !important; }
          .edit-gallery-item{ width: 46% !important; }
        }
      `}</style>
    </div>
  );
}

/* ======================= Main Profile Page ======================= */
export default function Profile() {
  const [showEdit, setShowEdit] = useState(false);
  const [artisan, setArtisan] = useState(null);
  const token = localStorage.getItem("token");
  const artisanId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchArtisan = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/v1/artisans/${artisanId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Failed to load profile.");
        setArtisan(await res.json());
      } catch (error) {
        console.error("Error:", error);
        await alertError("Failed to fetch artisan profile.");
      }
    };
    if (artisanId && token) fetchArtisan();
  }, [artisanId, token]);

  if (!artisan)
    return (
      <div className="text-center py-5">
        <p>Loading profile...</p>
      </div>
    );

  return (
    <div className="artisan-profile">
      <Navbar />

      {/* ===== Profile Info ===== */}
      <section className="container py-5 mt-5">
  <div className="row align-items-center justify-content-between">
    {/* صورة فوق الاسم على الجوال — أفقي على الديسكتوب */}
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
        <h6
          className="fw-bold mb-1 profile-name"
          style={{ color: "#3a0b0b", fontSize: "1.15rem", letterSpacing: "0.3px" }}
        >
          {artisan.name}
        </h6>

        <p className="services-list mb-2 d-flex flex-wrap gap-2 justify-content-md-start justify-content-center">
          {artisan.offersProduct && <span className="service-badge">Products</span>}
          {artisan.offersWorkshop && <span className="service-badge">Workshops</span>}
          {artisan.offersLiveShow && <span className="service-badge">Live Show</span>}
        </p>

        <p
          className="profile-bio mb-0 text-md-start text-center"
          style={{ color: "#6f4e37", lineHeight: "1.75", fontSize: "0.95rem", marginTop: "8px" }}
        >
          {artisan.bio && artisan.bio.trim() !== ""
            ? artisan.bio
            : "No bio yet — every craft tells a story waiting to be shared."}
        </p>
      </div>
    </div>

    <div className="col-md-4 mt-4 mt-md-0 d-flex gap-3 justify-content-md-end justify-content-center">
      <button className="btn btn-outline btn-small" onClick={() => setShowEdit(true)}>
        Edit Account
      </button>
    </div>
  </div>
</section>

<section className="container py-5 text-center">
  <h5
    className="fw-bold mb-5"
    style={{ color: "#3a0b0b", fontSize: "1.25rem", letterSpacing: "0.5px" }}
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
    />
  </h5>

  {Array.isArray(artisan.images) && artisan.images.filter(Boolean).length > 1 ? (
    <div className="row justify-content-center g-4 g-md-5">
      {artisan.images.slice(1).filter(Boolean).map((img, i) => (
        <div key={i} className="col-12 col-sm-6 col-md-4 d-flex flex-column align-items-center">
          <div className="overflow-hidden work-card shadow-sm" style={{ borderRadius: "10px" }}>
            <img
              src={img}
              alt={`Work ${i + 1}`}
              className="work-img"
              loading="lazy"
              decoding="async"
              style={{
                width: "100%",
                maxWidth: "340px",   // baseline للديسكتوب
                height: "420px",     // baseline للديسكتوب
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

      <EditAccountModal
        show={showEdit}
        onClose={() => setShowEdit(false)}
        artisan={artisan}
        setArtisan={setArtisan}
      />

      {/* ===== Responsive overrides (لا تغيّر الديسكتوب) ===== */}
      <style>{`
        /* تابلت وما دون */
        @media (max-width: 991.98px){
          .profile-avatar{ width: 80px !important; height: 80px !important; }
          .profile-name{ font-size: clamp(1rem, 1.8vw, 1.08rem) !important; }
          .profile-bio{ font-size: clamp(.9rem, 1.8vw, .95rem) !important; max-width: 60ch !important; }

          /* الكروت: استخدم نسبة أبعاد بدل ارتفاع ثابت */
          .work-card{ width: min(100%, 360px); aspect-ratio: 4 / 5; }
          .work-img{ width: 100% !important; height: 100% !important; max-width: none !important; object-fit: cover; }
        }

        /* جوال صغير */
        @media (max-width: 575.98px){
          .profile-avatar{ width: 72px !important; height: 72px !important; }
          .profile-bio{ padding-inline: 6px; line-height: 1.7; }
          .work-card{ width: 100%; }
        }

        /* تفضيل تقليل الحركة */
        @media (prefers-reduced-motion: reduce){
          * { transition: none !important; animation: none !important; }
        }
        /* دسكتوب (يبقى الشكل العام نفسه لكن نحسّن عرض السطر) */
@media (min-width: 992px){
  .profile-bio{
    max-width: 66ch !important;   /* أوسع قليلاً لمنع شكل "ممتدّ/مضغوط" */
    padding-inline: 0 !important;
    text-wrap: pretty;             /* لفّ أسطر أجمل */
  }
  .profile-name{ margin-bottom: .25rem !important; }
}

/* تابلت وما دون */
@media (max-width: 991.98px){
  .profile-avatar{ width: 80px !important; height: 80px !important; }
  .profile-name{ font-size: clamp(1rem, 1.8vw, 1.08rem) !important; }
  .profile-bio{
    max-width: 60ch !important;
    font-size: clamp(.9rem, 1.8vw, .95rem) !important;
    padding-inline: 6px;
    text-wrap: balance;            /* توازن الأسطر في الوسط */
  }
}

/* جوال صغير */
@media (max-width: 575.98px){
  .profile-avatar{ width: 72px !important; height: 72px !important; }
  .profile-bio{ line-height: 1.7; }
}

/* تقليل الحركة */
@media (prefers-reduced-motion: reduce){
  * { transition: none !important; animation: none !important; }
}

      `}</style>
    </div>
  );
}
