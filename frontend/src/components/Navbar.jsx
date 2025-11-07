import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const isHeroPage = location.pathname === "/marketplace";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName");
    const role = localStorage.getItem("userRole");
    setIsLoggedIn(!!token);
    setUserName(name || "");
    setUserRole(role || "");

    const checkLogin = () => {
      const token = localStorage.getItem("token");
      const name = localStorage.getItem("userName");
      const role = localStorage.getItem("userRole");
      setIsLoggedIn(!!token);
      setUserName(name || "");
      setUserRole(role || "");
    };

    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    navigate("/UserType");
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
      <div className="container d-flex justify-content-between align-items-center">
        {/* ===== Left Links ===== */}
        <div className="d-flex gap-4 align-items-center">
          {/* --- Public link before login --- */}
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

          {/* --- Client links --- */}
          {isLoggedIn && userRole === "client" && (
            <>
              {location.pathname !== "/client/Requests_C" && (
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

              {location.pathname !== "/marketplace" && (
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
            </>
          )}

          {/* --- Artisan links --- */}
          {isLoggedIn && userRole === "artisan" && (
            <>
              {location.pathname !== "/artisan/Profile" && (
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

              {location.pathname !== "/artisan/Requests_A" && (
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
            </>
          )}
        </div>

        {/* ===== Logo (Centered) ===== */}
        <Link
          to="/"
          className="navbar-brand m-0 d-flex justify-content-center align-items-center w-100 position-absolute start-50 translate-middle-x"
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

        {/* ===== Auth Section ===== */}
        <div
          className="d-flex justify-content-end align-items-center gap-3"
          style={{ minWidth: "100px" }}
        >
          {isLoggedIn ? (
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
                  transition: "opacity 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-decoration-none fw-semibold small"
              style={{
                color: isHeroPage ? "#f5f5ee" : "#3a0b0b",
                letterSpacing: "0.3px",
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
