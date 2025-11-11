// src/pages/artisan/Profile.jsx
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  alertSuccess,
  alertError,
  alertInfo,
  alertConfirm,
} from "../../components/ArumaAlert";

// قاعدة عنوان الـ API
const API =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

// أصل الخادم بدون /api/v1 لعرض الصور الداخلية
const ORIGIN = (() => {
  try {
    const u = new URL(API, window.location.origin);
    return u.toString().replace(/\/api\/v1\/?$/, "").replace(/\/+$/, "");
  } catch {
    return "http://127.0.0.1:8000";
  }
})();
const toImageURL = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${ORIGIN}${p}`;
};

// أداة صغيرة لإظهار الرسائل الحقيقية من الـ response عند الخطأ
async function readErr(res) {
  try {
    const j = await res.clone().json();
    return j?.detail || JSON.stringify(j);
  } catch {
    try {
      return await res.clone().text();
    } catch {
      return res.statusText || "Request failed";
    }
  }
}

/* ======================= Edit Account Modal ======================= */
function EditAccountModal({ show, onClose, artisan, setArtisan }) {
  const [form, setForm] = useState({
    bio: "",
    craftType: "",
    offersWorkshop: false,
    offersLiveShow: false,
    offersProduct: false,
    image: "",
  });

  // تعريف التوكن والآي دي داخل المكوّن
  const token = localStorage.getItem("token");
  const artisanId = localStorage.getItem("userId");

  useEffect(() => {
    if (artisan) {
      setForm({
        bio: artisan.bio || "",
        craftType: artisan.craftType || "",
        offersWorkshop: !!artisan.offersWorkshop,
        offersLiveShow: !!artisan.offersLiveShow,
        offersProduct: !!artisan.offersProduct,
        image: artisan.images?.[0] || artisan.image || "",
      });
    }
  }, [artisan]);

  if (!show) return null;

  const onChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  // ✅ تصحيح المسار إلى /uploads/image
  const uploadOne = async (file) => {
    if (!token) {
      await alertInfo("Please login again.");
      return "";
    }
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${API}/uploads/image`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    if (!res.ok) throw new Error(await readErr(res));
    const data = await res.json();
    return data.url;
  };

  const handleUpload = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const url = await uploadOne(f);
      if (!url) return;
      setForm((p) => ({ ...p, image: url }));
      await alertSuccess("Profile image uploaded!");
    } catch (err) {
      await alertError(err.message || "Upload error");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!token || !artisanId) {
      await alertInfo("Please login again.");
      return;
    }
    try {
      const res = await fetch(`${API}/artisans/${artisanId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bio: form.bio,
          craftType: form.craftType,
          offersWorkshop: form.offersWorkshop,
          offersLiveShow: form.offersLiveShow,
          offersProduct: form.offersProduct,
          image: form.image || "",
        }),
      });
      if (!res.ok) throw new Error(await readErr(res));
      const data = await res.json();
      setArtisan((prev) => ({ ...prev, ...data }));
      await alertSuccess("Account updated!");
      onClose();
    } catch (err) {
      await alertError(err.message || "Network error");
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div
          className="modal-content border-0 shadow"
          style={{ background: "#f5f5ee", borderRadius: 16 }}
        >
          <div className="d-flex justify-content-between align-items-center p-3">
            <h5 className="fw-bold m-0" style={{ color: "#3a0b0b" }}>
              Edit Account
            </h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <form onSubmit={submit} className="px-3 pb-4">
            <div className="mb-3">
              <label className="form-label fw-semibold small" style={{ color: "#3a0b0b" }}>
                Craft Type
              </label>
              <input
                className="form-control"
                name="craftType"
                value={form.craftType}
                onChange={onChange}
                placeholder="Pottery / Glass / ..."
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold small" style={{ color: "#3a0b0b" }}>
                Bio
              </label>
              <textarea
                className="form-control"
                name="bio"
                rows={3}
                value={form.bio}
                onChange={onChange}
                placeholder="Short description..."
              />
            </div>

            <div className="d-flex flex-wrap gap-3 mb-3">
              <label className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="offersWorkshop"
                  checked={form.offersWorkshop}
                  onChange={onChange}
                />
                <span className="ms-2">Workshops</span>
              </label>
              <label className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="offersLiveShow"
                  checked={form.offersLiveShow}
                  onChange={onChange}
                />
                <span className="ms-2">Live Show</span>
              </label>
              <label className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="offersProduct"
                  checked={form.offersProduct}
                  onChange={onChange}
                />
                <span className="ms-2">Products</span>
              </label>
            </div>

            {/* Profile image */}
            <div className="mb-4">
              <label
                className="btn"
                htmlFor="pf-upload"
                style={{ background: "#eae4de", color: "#3a0b0b", borderRadius: 8 }}
              >
                <i className="bi bi-camera-fill me-2" />{" "}
                {form.image ? "Change Image" : "Upload Image"}
              </label>
              <input
                id="pf-upload"
                type="file"
                accept="image/*"
                onChange={handleUpload}
                style={{ display: "none" }}
              />
              {form.image && (
                <img
                  src={toImageURL(form.image)}
                  alt="profile"
                  className="mt-3 rounded-circle border"
                  style={{ width: 100, height: 100, objectFit: "cover" }}
                />
              )}
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn"
                style={{ background: "#3a0b0b", color: "#fff" }}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ======================= Work Editor Modal ======================= */
function WorkEditor({ show, onClose, artisan, setArtisan }) {
  const token = localStorage.getItem("token");
  const artisanId = localStorage.getItem("userId");
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (artisan) {
      const imgs = Array.isArray(artisan.workImages) ? artisan.workImages : [];
      const titles = Array.isArray(artisan.workTitles) ? artisan.workTitles : [];
      const merged = imgs.map((u, i) => ({ url: u, title: titles[i] || "" }));
      setItems(merged);
    }
  }, [artisan]);

  if (!show) return null;

  const uploadOne = async (file) => {
    if (!token) {
      await alertInfo("Please login again.");
      return "";
    }
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${API}/uploads/image`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    if (!res.ok) throw new Error(await readErr(res));
    const data = await res.json();
    return data.url;
  };

  const addWork = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const url = await uploadOne(f);
      if (!url) return;
      const title = ""; // ينعرض ويتحرر داخل الكارد
      const res = await fetch(`${API}/artisans/${artisanId}/work`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url, title }),
      });
      if (!res.ok) throw new Error(await readErr(res));
      const data = await res.json();
      setArtisan((prev) => ({
        ...prev,
        workImages: data.workImages || [],
        workTitles: data.workTitles || [],
      }));
      await alertSuccess("Work added!");
      onClose();
    } catch (err) {
      await alertError(err.message || "Network error");
    }
  };

  const saveOne = async (index) => {
    const item = items[index];
    try {
      const res = await fetch(`${API}/artisans/${artisanId}/work/${index}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url: item.url, title: item.title || "" }),
      });
      if (!res.ok) throw new Error(await readErr(res));
      const data = await res.json();
      setArtisan((prev) => ({
        ...prev,
        workImages: data.workImages || [],
        workTitles: data.workTitles || [],
      }));
      await alertSuccess("Work updated!");
      onClose();
    } catch (err) {
      await alertError(err.message || "Network error");
    }
  };

  const deleteOne = async (index) => {
    const ok = await alertConfirm("Delete this work item?", {
      title: "Confirm",
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (!ok) return;
    try {
      const res = await fetch(`${API}/artisans/${artisanId}/work/${index}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await readErr(res));
      const data = await res.json();
      setArtisan((prev) => ({
        ...prev,
        workImages: data.workImages || [],
        workTitles: data.workTitles || [],
      }));
      await alertSuccess("Work deleted!");
      onClose();
    } catch (err) {
      await alertError(err.message || "Network error");
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div
          className="modal-content border-0 shadow"
          style={{ background: "#f5f5ee", borderRadius: 16 }}
        >
          <div className="d-flex justify-content-between align-items-center p-3">
            <h5 className="fw-bold m-0" style={{ color: "#3a0b0b" }}>
              Manage “My Work”
            </h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="px-3 pb-4">
            <label
              className="btn mb-3"
              htmlFor="work-add"
              style={{ background: "#eae4de", color: "#3a0b0b", borderRadius: 8 }}
            >
              <i className="bi bi-plus-circle me-2" /> Add Work
            </label>
            <input
              id="work-add"
              type="file"
              accept="image/*"
              onChange={addWork}
              style={{ display: "none" }}
            />

            <div className="row g-4">
              {items.map((it, i) => (
                <div key={i} className="col-12 col-sm-6 col-md-4">
                  <div className="border rounded-3 p-3" style={{ background: "#fff" }}>
                    <img
                      src={toImageURL(it.url)}
                      alt={`work-${i}`}
                      style={{
                        width: "100%",
                        height: 240,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                    <input
                      className="form-control mt-2"
                      placeholder="Title"
                      value={it.title}
                      onChange={(e) => {
                        const copy = [...items];
                        copy[i].title = e.target.value;
                        setItems(copy);
                      }}
                    />
                    <div className="d-flex justify-content-between mt-3">
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => deleteOne(i)}
                      >
                        Delete
                      </button>
                      <button
                        className="btn"
                        style={{ background: "#3a0b0b", color: "#fff" }}
                        onClick={() => saveOne(i)}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <p className="text-muted text-center">
                  No work yet — add your first piece.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- شارات الخدمات (مثل الكلاينت) ---------- */
function ServicesOffered({ artisan }) {
  const pills = [];
  if (artisan.offersProduct) {
    pills.push({ icon: "bag", text: "Products" });
  }
  if (artisan.offersWorkshop) {
    pills.push({ icon: "easel", text: "Workshops" });
  }
  if (artisan.offersLiveShow) {
    pills.push({ icon: "broadcast-pin", text: "Live Show" });
  }

  if (pills.length === 0) return null;

  return (
    <div className="d-flex flex-wrap gap-2 mt-2">
      {pills.map((p, i) => (
        <span
          key={i}
          className="badge d-inline-flex align-items-center"
          style={{
            background: "#eae4de",
            color: "#3a0b0b",
            padding: "0.5rem 0.75rem",
            borderRadius: "999px",
            fontWeight: 600,
          }}
        >
          <i className={`bi bi-${p.icon} me-1`} />
          {p.text}
        </span>
      ))}
    </div>
  );
}

/* ======================= Main Profile Page ======================= */
export default function Profile() {
  const [artisan, setArtisan] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showWorkEditor, setShowWorkEditor] = useState(false);

  const token = localStorage.getItem("token");
  const artisanId = localStorage.getItem("userId");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API}/artisans/${artisanId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.detail || "Load failed");
        setArtisan(data);
      } catch (err) {
        await alertError(err.message || "Failed to fetch artisan profile.");
      }
    };
    if (artisanId && token) load();
  }, [artisanId, token]);

  if (!artisan) {
    return (
      <div className="text-center py-5">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="artisan-profile">
      <Navbar />

      {/* Header */}
      <section className="container py-5 mt-5">
        <div className="row align-items-center justify-content-between">
          <div
            className="col-md-8 d-flex align-items-center flex-wrap flex-md-nowrap text-md-start text-center"
            style={{ gap: "1.5rem" }}
          >
            <img
              src={
                toImageURL(artisan.images?.[0] || artisan.image) ||
                "/images/default_profile.png"
              }
              alt="Profile"
              className="rounded-circle"
              style={{
                width: 90,
                height: 90,
                objectFit: "cover",
                border: "1px solid #d3d3d3",
                backgroundColor: "#e7e7e7",
              }}
            />
            <div>
              <h6
                className="fw-bold mb-1"
                style={{ color: "#3a0b0b", fontSize: "1.15rem" }}
              >
                {artisan.name}
              </h6>
              <small className="text-muted">{artisan.craftType || ""}</small>
              <p
                className="small mb-0 mt-2"
                style={{ color: "#6f4e37", lineHeight: 1.8, maxWidth: 520 }}
              >
                {artisan.bio?.trim()
                  ? artisan.bio
                  : "No bio yet — every craft tells a story waiting to be shared."}
              </p>

              {/* ✅ الخدمات التي أقدمها */}
              <ServicesOffered artisan={artisan} />
            </div>
          </div>

          <div className="col-md-4 mt-4 mt-md-0 d-flex gap-2 justify-content-md-end justify-content-center">
            <button
              className="btn btn-outline-secondary"
              onClick={() => setShowEdit(true)}
            >
              Edit Account
            </button>
            <button
              className="btn"
              style={{ background: "#3a0b0b", color: "#fff" }}
              onClick={() => setShowWorkEditor(true)}
            >
              + Add Work
            </button>
          </div>
        </div>
      </section>

      <div
        className="container"
        style={{
          borderBottom: "1px solid #cbbeb3",
          opacity: 0.5,
          marginBottom: "2rem",
        }}
      />

      {/* My Work */}
      <section className="container pb-5">
        <h5 className="fw-bold mb-4" style={{ color: "#3a0b0b" }}>
          My Work
          <span className="ms-2 text-muted fw-normal" style={{ fontSize: 14 }}>
            ({artisan.workImages?.length || 0})
          </span>
        </h5>

        {artisan.workImages?.length ? (
          <div className="row g-4">
            {artisan.workImages.map((u, i) => (
              <div key={i} className="col-12 col-sm-6 col-lg-4">
                <div className="position-relative">
                  <img
                    src={toImageURL(u)}
                    alt={`work-${i}`}
                    style={{
                      width: "100%",
                      height: 420,
                      objectFit: "cover",
                      borderRadius: 12,
                    }}
                  />
                  <div className="position-absolute top-0 end-0 p-2 d-flex gap-2">
                    <button
                      className="btn btn-light btn-sm"
                      title="Edit"
                      onClick={() => setShowWorkEditor(true)}
                    >
                      <i className="bi bi-pencil" />
                    </button>
                    <button
                      className="btn btn-light btn-sm"
                      title="Delete"
                      onClick={() => setShowWorkEditor(true)}
                    >
                      <i className="bi bi-trash" />
                    </button>
                  </div>
                </div>
                <h6 className="fw-semibold mt-2" style={{ color: "#3a0b0b" }}>
                  {artisan.workTitles?.[i] || `Artwork ${i + 1}`}
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
      <WorkEditor
        show={showWorkEditor}
        onClose={() => setShowWorkEditor(false)}
        artisan={artisan}
        setArtisan={setArtisan}
      />
    </div>
  );
}
