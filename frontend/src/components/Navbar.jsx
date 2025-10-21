import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // ✅ لتحديد المسار الحالي

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName");
    const role = localStorage.getItem("userRole");
    setIsLoggedIn(!!token);
    setUserName(name || "");
    setUserRole(role || "");

    // تحديث الحالة عند أي تغيير في localStorage
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
    navigate("/UserType"); // إعادة التوجيه بعد تسجيل الخروج
  };

  return (
    <nav
      className="navbar navbar-expand-lg py-3 shadow-0"
      style={{
        backgroundColor: "#f5f5ee",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
      }}
    >
      <div className="container d-flex justify-content-between align-items-center">
        {/* ===== Left Links ===== */}
        <div className="d-flex gap-4 align-items-center">
          {/* قبل تسجيل الدخول */}
          {!isLoggedIn && (
            <Link
              to="/"
              className="text-decoration-none fw-semibold small"
              style={{
                color: "#3a0b0b",
                letterSpacing: "0.3px",
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Home
            </Link>
          )}

          {/* بعد تسجيل الدخول كـ Client */}
          {isLoggedIn && userRole === "client" && (
            <>
              <Link
                to="/client/Requests_C"
                className="text-decoration-none fw-semibold small"
                style={{
                  color: "#3a0b0b",
                  letterSpacing: "0.3px",
                  transition: "opacity 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                My Requests
              </Link>

              {/* ✅ يظهر فقط إذا لم نكن في صفحة /marketplace */}
              {location.pathname !== "/marketplace" && (
                <Link
                  to="/marketplace"
                  className="text-decoration-none fw-semibold small"
                  style={{
                    color: "#3a0b0b",
                    letterSpacing: "0.3px",
                    transition: "opacity 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.opacity = "0.7")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.opacity = "1")
                  }
                >
                  Marketplace
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
            src="/logo.png"
            alt="Aruma Logo"
            width="52"
            style={{
              filter: "contrast(90%) brightness(95%)",
              opacity: "0.95",
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
                  color: "#3a0b0b",
                  opacity: 0.85,
                  letterSpacing: "0.3px",
                }}
              >
                Hi, {userName || "there"}
              </span>

              <button
                onClick={handleLogout}
                className="btn btn-link text-decoration-none fw-semibold small"
                style={{
                  color: "#3a0b0b",
                  letterSpacing: "0.3px",
                  transition: "opacity 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.opacity = "0.7")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.opacity = "1")
                }
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-decoration-none fw-semibold small"
              style={{
                color: "#3a0b0b",
                letterSpacing: "0.3px",
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.opacity = "0.7")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.opacity = "1")
              }
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
