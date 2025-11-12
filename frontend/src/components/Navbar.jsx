import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // لتفعيل collapse بالجوال

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const isHeroPage = location.pathname === "/marketplace";

  // تحديث حالة الأوث عند التحميل/التنقّل/رجوع التركيز/تغيّر التخزين
  useEffect(() => {
    const updateAuth = () => {
      const token = localStorage.getItem("token");
      const name = localStorage.getItem("userName");
      const role = localStorage.getItem("userRole");
      setIsLoggedIn(!!token);
      setUserName(name || "");
      setUserRole(role || "");
    };

    updateAuth();
    window.addEventListener("focus", updateAuth);
    window.addEventListener("storage", updateAuth);

    const onAuthChange = () => updateAuth();
    window.addEventListener("authchange", onAuthChange);

    return () => {
      window.removeEventListener("focus", updateAuth);
      window.removeEventListener("storage", updateAuth);
      window.removeEventListener("authchange", onAuthChange);
    };
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    navigate("/UserType");
  };

  // إغلاق منيو الجوال برمجيًا
  const closeMobileMenu = () => {
    const el = document.getElementById("mobileNav");
    if (!el) return;
    const bs = window.bootstrap?.Collapse?.getOrCreateInstance(el);
    if (bs) {
      bs.hide();
      return;
    }
    // fallback
    el.classList.remove("show");
    const btn = document.querySelector('[data-bs-target="#mobileNav"]');
    if (btn) btn.setAttribute("aria-expanded", "false");
  };

  // تنقّل + إغلاق المنيو
  const handleNav = (to) => {
    navigate(to);
    closeMobileMenu();
  };

  return (
    <nav
      className="navbar navbar-expand-lg shadow-0"
      style={{
        paddingTop: "2.75rem",
        paddingBottom: "2.75rem",
        backgroundColor: isHeroPage ? "transparent" : "var(--color-background)",
        borderBottom: isHeroPage ? "none" : "1px solid rgba(0, 0, 0, 0.05)",
        position: isHeroPage ? "absolute" : "relative",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 10,
        transition: "all 0.3s ease",
      }}
    >
      <div className="container d-flex justify-content-between align-items-center position-relative">
        {/* ===== Left Links (Desktop only) ===== */}
        <div className="d-none d-lg-flex gap-4 align-items-center">
          {!isLoggedIn && (
            <Link
              to="/"
              className="text-decoration-none fw-semibold small"
              style={{
                color: isHeroPage ? "#f5f5ee" : "#3a0b0b",
                letterSpacing: "0.3px",
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Home
            </Link>
          )}

          {isLoggedIn && userRole === "client" && location.pathname !== "/client/Requests_C" && (
            <Link
              to="/client/Requests_C"
              className="text-decoration-none fw-semibold small"
              style={{
                color: isHeroPage ? "#f5f5ee" : "#3a0b0b",
                letterSpacing: "0.3px",
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              My Requests
            </Link>
          )}

          {isLoggedIn && userRole === "client" && location.pathname !== "/marketplace" && (
            <Link
              to="/marketplace"
              className="text-decoration-none fw-semibold small"
              style={{
                color: isHeroPage ? "#f5f5ee" : "#3a0b0b",
                letterSpacing: "0.3px",
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Marketplace
            </Link>
          )}

          {isLoggedIn && userRole === "artisan" && location.pathname !== "/artisan/Profile" && (
            <Link
              to="/artisan/Profile"
              className="text-decoration-none fw-semibold small"
              style={{
                color: isHeroPage ? "#f5f5ee" : "#3a0b0b",
                letterSpacing: "0.3px",
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Profile
            </Link>
          )}

          {isLoggedIn && userRole === "artisan" && location.pathname !== "/artisan/Requests_A" && (
            <Link
              to="/artisan/Requests_A"
              className="text-decoration-none fw-semibold small"
              style={{
                color: isHeroPage ? "#f5f5ee" : "#3a0b0b",
                letterSpacing: "0.3px",
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              My Requests
            </Link>
          )}
        </div>

        {/* ===== Logo (Centered) — Desktop only ===== */}
        <Link
          to="/"
          className="navbar-brand m-0 d-none d-lg-flex justify-content-center align-items-center w-100 position-absolute start-50 translate-middle-x"
          style={{ pointerEvents: "none" }}
        >
          <img
            src={isHeroPage ? "/logo2.png" : "/logo.png"}
            alt="Aruma Logo"
            width="77"
            style={{
              filter: isHeroPage
                ? "contrast(100%) brightness(100%)"
                : "contrast(90%) brightness(95%)",
              opacity: "0.95",
              transition: "filter 0.3s ease",
            }}
          />
        </Link>

        {/* ===== Auth (Desktop) ===== */}
        <div
          className="d-none d-lg-flex justify-content-end align-items-center gap-3"
          style={{ minWidth: "100px" }}
        >
          {isLoggedIn && (
            <>
              <span
                className="fw-semibold small"
                style={{
                  color: isHeroPage ? "#f5f5ee" : "#3a0b0b",
                  opacity: 0.9,
                  letterSpacing: "0.3px",
                }}
              >
                Hi, {userName || "there"}
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-link text-decoration-none fw-semibold small"
                style={{
                  color: isHeroPage ? "#f5f5ee" : "#3a0b0b",
                  letterSpacing: "0.3px",
                }}
              >
                Log out
              </button>
            </>
          )}
        </div>

        {/* ===== Mobile header (logo center + hamburger right) ===== */}
        <div className="d-flex d-lg-none w-100 align-items-center justify-content-center position-relative">
          <button
            className="navbar-toggler border-0 position-absolute end-0 me-1"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mobileNav"
            aria-controls="mobileNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{ zIndex: 11 }}
          >
            <span
              className="navbar-toggler-icon"
              style={{
                filter: isHeroPage ? "invert(100%) brightness(200%)" : "invert(20%)",
              }}
            ></span>
          </button>

          <Link
            to="/"
            className="m-0 p-0 d-flex align-items-center justify-content-center"
            style={{ zIndex: 10 }}
          >
            <img
              src={isHeroPage ? "/logo2.png" : "/logo.png"}
              alt="Aruma Logo"
              width="74"
              style={{
                filter: isHeroPage
                  ? "contrast(100%) brightness(100%)"
                  : "contrast(90%) brightness(95%)",
                opacity: "0.98",
              }}
            />
          </Link>
        </div>
      </div>

      {/* ===== Mobile Menu (collapse) ===== */}
      <div
        className="collapse d-lg-none position-absolute start-0 end-0"
        id="mobileNav"
        style={{ top: "100%", padding: "0 1rem", zIndex: 2000 }}
      >
        <ul
          className="navbar-nav text-center mx-auto mt-2"
          style={{
            backgroundColor: isHeroPage ? "rgba(0,0,0,0.85)" : "#f5f5ee",
            borderRadius: "12px",
            padding: "1rem",
            maxWidth: "520px",
            margin: "0 auto",
            animation: "slideDown 220ms ease",
          }}
        >
          {!isLoggedIn && (
            <li className="nav-item">
              <button
                type="button"
                className="nav-link fw-semibold btn btn-link w-100 text-decoration-none"
                style={{ color: isHeroPage ? "#f5f5ee" : "#3a0b0b" }}
                onClick={() => handleNav("/")}
              >
                Home
              </button>
            </li>
          )}

          {isLoggedIn && userRole === "client" && location.pathname !== "/client/Requests_C" && (
            <li className="nav-item">
              <button
                type="button"
                className="nav-link fw-semibold btn btn-link w-100 text-decoration-none"
                style={{ color: isHeroPage ? "#f5f5ee" : "#3a0b0b" }}
                onClick={() => handleNav("/client/Requests_C")}
              >
                My Requests
              </button>
            </li>
          )}

          {isLoggedIn && userRole === "client" && location.pathname !== "/marketplace" && (
            <li className="nav-item">
              <button
                type="button"
                className="nav-link fw-semibold btn btn-link w-100 text-decoration-none"
                style={{ color: isHeroPage ? "#f5f5ee" : "#3a0b0b" }}
                onClick={() => handleNav("/marketplace")}
              >
                Marketplace
              </button>
            </li>
          )}

          {isLoggedIn && userRole === "artisan" && location.pathname !== "/artisan/Profile" && (
            <li className="nav-item">
              <button
                type="button"
                className="nav-link fw-semibold btn btn-link w-100 text-decoration-none"
                style={{ color: isHeroPage ? "#f5f5ee" : "#3a0b0b" }}
                onClick={() => handleNav("/artisan/Profile")}
              >
                Profile
              </button>
            </li>
          )}

          {isLoggedIn && userRole === "artisan" && location.pathname !== "/artisan/Requests_A" && (
            <li className="nav-item">
              <button
                type="button"
                className="nav-link fw-semibold btn btn-link w-100 text-decoration-none"
                style={{ color: isHeroPage ? "#f5f5ee" : "#3a0b0b" }}
                onClick={() => handleNav("/artisan/Requests_A")}
              >
                My Requests
              </button>
            </li>
          )}

          {isLoggedIn && (
            <li className="nav-item mt-2">
              <button
                type="button"
                onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                }}
                className="btn btn-link fw-semibold text-decoration-none w-100 text-start text-center"
                style={{ color: isHeroPage ? "#f5f5ee" : "#3a0b0b" }}
              >
                Log out
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* حركة انزلاق للقائمة بالجوال */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 991px) {
          .navbar { padding-top: 1.25rem !important; padding-bottom: 1.25rem !important; }
        }
      `}</style>
    </nav>
  );
}