import React, { useEffect, useState } from "react";

/* ================== DATA ================== */
const PROJECT = {
  name: "Aruma",
  tagline:
    "The main goal of the platform is to empower artisans to showcase their products and services, reach more clients, and strengthen their market presence through a comprehensive digital space.",
  logo: "/ArumaLogo.png",     
  coverImage: "/cover.jpg",
  deployedUrl: "https://aruma-seven.vercel.app/",
  repoUrl: "https://github.com/maram-ra/Aruma",
  holbertonUrl: "https://www.holbertonschool.com/",
  TuwaiqUrl: "https://tuwaiq.edu.sa/",
};

const FEATURES = [
  {
    title: "1. User Type",
    description: "Aruma serves two types of users: artisans and clients. Through this page you can choose the type of account that best suits your needs. ",
    gallery: [
      { src: "User Type.png", label: "User Type" },
    ],
  },
  {
    title: "2. Client Registration & Login",
    description: "Through these two pages, clients can register and log into their profile..",
    gallery: [
      { src: "cRegistration.png", label: "Client Registration" },
      { src: "Login.png", label: "Client Login" },
    ],
  },
  {
    title: "3. Artisan Registration & Login",
    description: "Through these two pages, artisans can register and log into their profile..",
    gallery: [
      { src: "aRegistration.png", label: "Artisan Registration" },
      { src: "Login.png", label: "Artisan Login" },
    ],
  },
  {
    title: "4. Marketplace Browsing",
    description: "Through this page, clients can browse the artisans and visit their profiles.",
    gallery: [
      { src: "Marketplace.png", label: "Marketplace" },
      { src: "Marketplace2.png", label: "Marketplace" },
    ],
  },
  {
    title: "5. Artisan Profile Management",
    description: "Through these pages, the artisans can view and edit all the data displayed in their profiles.",
    gallery: [
      { src: "aArtisan_Profile.png", label: "Artisans View To Their Profile" },
      { src: "aEdit_Account.png", label: "The 'Edit Account' Form" },
      { src: "aMy_Work.png", label: "The 'Manage My Work' Form" },
    ],
  },
  {
    title: "6. Browsing the Artisan Profile and sending request",
    description: "Through these pages, clients can browse the artisans profiles and send requests.",
    gallery: [
      { src: "cArtisan_Profile.png", label: "Clients View To The Artisan Profile" },
      { src: "cSend_Request.png", label: "The 'Send Request' Form" },
    ],
  },
  {
    title: "7. Requests Tracking",
    description: "Both the artisans and the clients can track the status of their requests ; each has a page that suits their needs.",
    gallery: [
      { src: "aRequests Tracking.png", label: "Artisan veiw to the Requests page" },
      { src: "cRequests_Tracking.png", label: "Clients view to the Requests page" },
    ],
  },
];

const TEAM = [
  {
    name: "Maram Alsofyani",
    role: "Frontend Developer & UI/UX Designer",
    links: { 
      linkedin: "https://www.linkedin.com/in/maram-alsufyani-b2a761259?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", 
      github: "https://github.com/maram-ra" },
  },
  {
    name: "Shurooq Alabbadi",
    role: "Frontend Developer & QA Engineer",
    links: { 
      linkedin: "https://www.linkedin.com/in/shurooq-alabbadi-1738131b6?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      github: "https://github.com/ShAlabbadi" },
  },
  {
    name: "Razan Alabdulhadi",
    role: "Backend Developer & QA Engineer",
    links: {
      linkedin: "https://www.linkedin.com/in/razan-alabdulhadii-?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      github: "https://github.com/CODERrazan",
    },
  },
  {
    name: "Layan Aljunayh",
    role: "Backend & Database Developer",
    links: { 
      linkedin: "https://www.linkedin.com/in/layan-aljunayh-?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", 
      github: "https://github.com/CoderLayan" },
  },
];


/* ================== PAGE ================== */
export default function ArumaLandingPage() {
  useEffect(() => {
    // Smooth scroll for in-page links
    const onClick = (e) => {
      const a = e.target.closest("a[href^='#']");
      if (!a) return;
      const id = a.getAttribute("href");
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const brand = {
    text: "#3a0b0b",
    subtle: "#5a5050",
    border: "#e0ddd3",
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* ================= HEADER ================= */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: "var(--color-bg)",
          borderBottom: `1px solid ${brand.border}`,
          backdropFilter: "blur(6px)",
        }}
      > 
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr", // left / center / right
            alignItems: "center",
            height: "80px",
            gap: "16px",
          }}
        >
          {/* LEFT: Nav */}
          <nav
              className="flex flex-wrap items-center gap-3 text-sm sm:text-base"
            style={{
              justifySelf: "start",
              display: "flex",
              alignItems: "center",
              gap: "24px",
              margin: "0 20px",
            }}
          >
            <a href="#features" className="btn-text" style={{ color: brand.text }}>
              Features
            </a>
            <a href="#about" className="btn-text" style={{ color: brand.text }}>
              About
            </a>
          </nav>

          {/* CENTER: Clickable logo to top */}
          <div className="order-first sm:order-none w-full sm:w-auto flex justify-center">
            <a href="#home" >
              <img
                src={PROJECT.logo}
                alt="Aruma Logo"
                className="object-contain cursor-pointer hover:opacity-80 transition"
                style={{
                  height: "56px",
                  width: "auto",
                  filter: "contrast(95%) brightness(98%)",
                  transition: "opacity 0.3s ease",
                }}
              />
            </a>
          </div>

          {/* RIGHT: Button */}
          <div style={{ justifySelf: "end" }}>
            <a
              href={PROJECT.deployedUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-main btn-small"
            >
              Go to Aruma Website
            </a>
          </div>
        </div>
      </header>
      {/* Spacer for fixed header */}
      <div style={{ height: "80px" }} />

      {/* ================= HERO ================= */}
      <section id="home" className="relative">
        <div
          className="w-full"
          style={{
            height: "50vh",
            minHeight: "320px",
            maxHeight: "640px",
            backgroundImage: `url(${PROJECT.coverImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="max-w-7xl mx-auto px-6">
          <div
            className="relative -mt-20 rounded-2xl p-8 sm:p-10"
            style={{
              border: `1px solid ${brand.border}`,
              margin: "0 40px",
            }}
          >
            <div className="text-center">
              <h1
                className="hero-title mb-3"
                style={{
                  color: brand.text,
                  fontSize: "2.5rem",
                  lineHeight: 1.15,
                }}
              >
                {PROJECT.name}
              </h1>
              <p
                className="hero-subtext mx-auto"
                style={{
                  color: brand.subtle,
                  fontSize: "1.2rem",
                }}
              >
                {PROJECT.tagline}
              </p>
            </div>
          </div>
        </div>
      </section>

{/* ================= FEATURES ================= */}
<section id="features">
  <h2
    className="text-4xl font-semibold mb-10 text-center"
    style={{ color: brand.text, margin: "0 40px" }}
  >
    Features
  </h2>

  <div className="max-w-7xl mx-auto px-6 space-y-20">
    {FEATURES.map((f, i) => {
      const gallery = Array.isArray(f.gallery) ? f.gallery : [];
      const ph = (w, h, txt) =>
        `https://placehold.co/${w}x${h}?text=${encodeURIComponent(txt)}`;

      // --- layout rules per feature ---
      const getLayout = (idx) => {
        switch (idx) {
          case 0: return { cols: 1, count: 1, stacked: false }; // 1 image
          case 1: return { cols: 2, count: 2, stacked: false };
          case 2: return { cols: 2, count: 2, stacked: false };
          case 3: return { cols: 1, count: 2, stacked: true  };
          case 4: return { cols: 3, count: 3, stacked: false };
          case 5: return { cols: 2, count: 2, stacked: false };
          case 6: return { cols: 2, count: 2, stacked: false };
          default: return { cols: 2, count: 2, stacked: false };
        }
      };

      const layout = getLayout(i);

      // normalize gallery items
      const items = gallery
        .slice(0, layout.count)
        .map((img, idx) => ({
          src:
            typeof img === "string"
              ? img
              : img?.src || ph(560, 420, `${f.title} ${idx + 1}`),
          label:
            typeof img === "object" && img?.label
              ? img.label
              : `Image ${idx + 1}`,
        }));

      // --- title + description ---
      const TitleBlock = (
        <div
          className="text-center mb-8"
          style={{ color: brand.subtle, margin: "0 50px" }}
        >
          <h3
            className="text-3xl font-semibold mb-3"
            style={{ color: brand.text }}
          >
            {f.title}
          </h3>
          {f.description && (
            <p
              className="text-lg leading-relaxed max-w-2xl mx-auto"
              style={{ color: brand.subtle }}
            >
              {f.description}
            </p>
          )}
        </div>
      );

      // --- grid wrapper style ---
      const gridStyle = {
        display: "grid",
        gridTemplateColumns: `repeat(${
          layout.stacked ? 1 : layout.cols
        }, minmax(0, 1fr))`,
        gap: "24px",
        alignItems: "stretch",
        maxWidth: "1100px",
        margin: "0 auto",
      };

      return (
        <div key={i} className="w-full">
          {TitleBlock}

          <div style={gridStyle}>
            {items.map(({ src, label }, idx) => (
              <div
                key={idx}
                style={{
                  border: "2px solid #3a0b0b",
                  borderRadius: "12px",
                  overflow: "visible",
                  transition: "transform 0.3s ease, border-color 0.3s ease",
                }}
                className="hover:scale-105"
              >
                <img
                  src={src}
                  alt={label}
                    className="block w-full object-cover"
                    style={{
                      width: "100%",
                      maxWidth: "1100px",
                      border: `1px solid ${brand.border}`,
                      borderRadius: "12px",
                      display: "block",
                    }}
                      />
                <p
                  style={{
                    color: "#3a0b0b",
                    textAlign: "center",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    padding: "10px 0",
                    borderTop: `1px solid ${brand.border}`,
                  }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* divider between features */}
            <hr
              style={{
                margin: "50px auto",
                width: "80%",
                border: `1px solid ${brand.border}`,
                opacity: 0.8,
              }}
            />
          
        </div>
      );
    })}
  </div>
</section>




      {/* ================= ABOUT / DEVELOPERS ================= */}
      <section id="about" className="py-20" style={{ margin: "0 40px" }}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-semibold mb-6" style={{ color: brand.text }}>
            About the Project
          </h2>
          <p className="max-w-2xl mb-12" style={{ color: brand.subtle }}>
          This project was inspired by a real challenge faced by many Saudi artisans — the lack of a unified digital space to showcase their craftsmanship and connect with modern clients. During the Year of Handicrafts 2025, we recognized how much talent exists within our local communities, yet how difficult it can be for artisans to gain visibility or manage their work online.
Aruma was designed to bridge that gap — empowering artisans with a dedicated digital platform to present their creations, receive requests, and grow their presence in the marketplace.
This project was developed collaboratively as part of our {" "}
            It’s also part of my Portfolio Project for{" "}
            <a
              href={PROJECT.holbertonUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#E74C3C",
                textDecoration: "underline",
                textDecorationStyle: "dotted",
              }}
            >
              Holberton School
            </a>{" "}
            Supervised by{" "}
            <a
              href={PROJECT.TuwaiqUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#6B1E83",
                textDecoration: "underline",
                textDecorationStyle: "dotted",
              }}
            >
              Tuwaiq Academy 
            </a>
            , and represents our shared vision to combine technology and culture in a meaningful way.
          </p>

          <h3 className="text-2xl font-semibold mb-8" style={{ color: brand.text }}>
            Our Developers
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: "24px",
              alignItems: "stretch",
              width: "100%",
            }}
          >
            {TEAM.map((m, i) => (
              <div
                key={i}
                style={{
                  background: "#f5f5ee",
                  border: `1px solid ${brand.border}`,
                  borderRadius: "16px",
                  padding: "22px",
                  textAlign: "left",
                  height: "100%",
                }}
              >
                <h4
                  style={{
                    color: brand.text,
                    fontWeight: 700,
                    margin: "0 0 6px",
                    fontSize: "18px",
                  }}
                >
                  {m.name}
                </h4>
                <p
                  style={{
                    color: "#6a5e5e",
                    margin: "0 0 14px",
                    fontSize: "15px",
                  }}
                >
                  {m.role}
                </p>

                <div
                  style={{
                    display: "inline-flex",
                    gap: "14px",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {/* LinkedIn (inline SVG) */}
                  <a
                    href={m.links.linkedin || "#"}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#0a66c2",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M0 1.146C0 .513.324 0 .725 0h14.55c.4 0 .725.513.725 1.146v13.708c0 .633-.325 1.146-.725 1.146H.725A.723.723 0 010 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.21c.837 0 1.357-.554 1.357-1.248-.015-.708-.52-1.247-1.341-1.247-.82 0-1.358.539-1.358 1.247 0 .694.52 1.248 1.326 1.248h.016zM13.458 13.394V9.359c0-2.165-1.156-3.174-2.698-3.174-1.243 0-1.8.676-2.109 1.151v-1h-2.4c.03.66 0 7.058 0 7.058h2.4v-3.945c0-.211.016-.42.078-.573.172-.419.563-.853 1.221-.853.861 0 1.206.643 1.206 1.587v3.784h2.302z" />
                    </svg>
                    LinkedIn
                  </a>

                  {/* GitHub (inline SVG) */}
                  <a
                    href={m.links.github}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#171515",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52 0-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.65 7.65 0 018 4.81c.68.003 1.37.092 2.01.27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                    </svg>
                    GitHub
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-10 border-t" style={{ borderColor: brand.border }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p style={{ color: "#6a5e5e" }}>
            © {new Date().getFullYear()} {PROJECT.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
