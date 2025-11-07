/* ===================== Aruma Alert Banner & Confirm Dialog ===================== */
const theme = {
  success: "#3c7c59",
  error: "#a13a3a",
  info: "#3a0b0b",
  text: "#fff",
  beige: "#f9f7f2",
  border: "#cbbeb3",
};

/* ---------- 🔹 Top Banner (Success / Error / Info) ---------- */
function showBanner(type, message) {
  const banner = document.createElement("div");
  Object.assign(banner.style, {
    position: "fixed",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "12px 20px",
    borderRadius: "8px",
    fontWeight: "600",
    color: theme.text,
    backgroundColor: theme[type],
    zIndex: "9999",
    fontSize: "0.95rem",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    transition: "opacity 0.3s ease",
    opacity: "0",
  });

  banner.textContent = message;
  document.body.appendChild(banner);

  setTimeout(() => (banner.style.opacity = "1"), 10);
  setTimeout(() => {
    banner.style.opacity = "0";
    setTimeout(() => banner.remove(), 300);
  }, 2500);
}

/* ---------- 🔹 Elegant Confirm Dialog ---------- */
function showConfirm(message, { title = "Confirm", confirmText = "Yes", cancelText = "Cancel" } = {}) {
  return new Promise((resolve) => {
    // Overlay
    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.35)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      backdropFilter: "blur(2px)",
    });

    // Dialog
    const dialog = document.createElement("div");
    Object.assign(dialog.style, {
      backgroundColor: theme.beige,
      borderRadius: "14px",
      padding: "28px 26px 24px",
      width: "90%",
      maxWidth: "380px",
      boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
      border: `1px solid ${theme.border}`,
      fontFamily: "inherit",
      textAlign: "center",
      opacity: "0",
      transform: "scale(0.9)",
      transition: "all 0.25s ease",
    });

    // Title
    const titleEl = document.createElement("h4");
    titleEl.textContent = title;
    Object.assign(titleEl.style, {
      color: theme.info,
      fontWeight: 700,
      fontSize: "1.1rem",
      margin: "0 0 10px",
    });

    // Message
    const msgEl = document.createElement("p");
    msgEl.textContent = message;
    Object.assign(msgEl.style, {
      color: "#5c4b45",
      fontSize: "0.95rem",
      lineHeight: "1.6",
      margin: "0 0 20px",
      whiteSpace: "pre-wrap",
    });

    // Buttons wrapper
    const btnWrap = document.createElement("div");
    Object.assign(btnWrap.style, {
      display: "flex",
      justifyContent: "space-between",
      gap: "12px",
    });

    // Cancel button
    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = cancelText;
    Object.assign(cancelBtn.style, {
      flex: 1,
      borderRadius: "20px",
      border: `1px solid ${theme.border}`,
      padding: "8px 16px",
      fontWeight: 500,
      backgroundColor: "transparent",
      color: theme.info,
      cursor: "pointer",
    });

    // Confirm button
    const confirmBtn = document.createElement("button");
    confirmBtn.textContent = confirmText;
    Object.assign(confirmBtn.style, {
      flex: 1,
      borderRadius: "20px",
      border: "none",
      padding: "8px 16px",
      fontWeight: 600,
      backgroundColor: theme.info,
      color: "#fff",
      cursor: "pointer",
      transition: "opacity 0.2s",
    });
    confirmBtn.onmouseover = () => (confirmBtn.style.opacity = "0.85");
    confirmBtn.onmouseout = () => (confirmBtn.style.opacity = "1");

    // Events
    cancelBtn.onclick = () => close(false);
    confirmBtn.onclick = () => close(true);
    overlay.addEventListener("click", (e) => e.target === overlay && close(false));
    window.addEventListener("keydown", (e) => e.key === "Escape" && close(false));

    function close(result) {
      dialog.style.opacity = "0";
      dialog.style.transform = "scale(0.9)";
      setTimeout(() => {
        overlay.remove();
        resolve(result);
      }, 200);
    }

    // Assemble
    btnWrap.appendChild(cancelBtn);
    btnWrap.appendChild(confirmBtn);
    dialog.appendChild(titleEl);
    dialog.appendChild(msgEl);
    dialog.appendChild(btnWrap);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    setTimeout(() => {
      dialog.style.opacity = "1";
      dialog.style.transform = "scale(1)";
    }, 10);
  });
}

/* ---------- 🔹 Exported Alerts ---------- */
export const alertSuccess = (msg) => showBanner("success", msg);
export const alertError = (msg) => showBanner("error", msg);
export const alertInfo = (msg) => showBanner("info", msg);
export const alertConfirm = (msg, opts) => showConfirm(msg, opts);
