import React from "react";

export default function WorkGallery() {
  const works = [
    { img: "/images/work1.jpg", title: "Lapis Stud", desc: "Minimal handcrafted stud inspired by desert tones." },
    { img: "/images/work2.jpg", title: "Vintage Fetish Bear Necklace", desc: "A unique silver necklace reflecting heritage and craftsmanship." },
    { img: "/images/work3.jpg", title: "Lapis Stud", desc: "Elegant lapis design with a modern minimal touch." },
    { img: "/images/work4.jpg", title: "Vintage Turquoise Ring", desc: "Classic turquoise ring blending traditional and modern aesthetics." },
    { img: "/images/work5.jpg", title: "Misawa Mini Hoop Earrings - Pair", desc: "Small hoops inspired by natural textures and simple forms." },
    { img: "/images/work6.jpg", title: "Bonnie Bracelet", desc: "Delicate bracelet crafted to represent balance and movement." },
  ];

  return (
    <section className="container py-5 text-center">
      {/* ===== Section Title ===== */}
      <h5
        className="fw-bold mb-5"
        style={{
          color: "#3a0b0b",
          fontSize: "clamp(1.05rem, 1.4vw, 1.25rem)",
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
            opacity: 0.8,
          }}
        />
      </h5>

      {/* ===== Image Grid ===== */}
      <div className="row justify-content-center g-4 g-md-5">
        {works.map((work, i) => (
          <div
            className="col-6 col-md-4 d-flex flex-column align-items-center"
            key={i}
          >
            {/* Card */}
            <div className="work-card shadow-sm">
              <img
                src={work.img}
                alt={work.title}
                loading="lazy"
                decoding="async"
                className="work-img"
              />
            </div>

            {/* النص تحت الصورة */}
            <h6
              className="fw-semibold mt-3 mb-1"
              style={{ color: "#3a0b0b", fontSize: "clamp(.95rem, 1.2vw, 1rem)" }}
            >
              {work.title}
            </h6>
            <p
              className="mb-0"
              style={{
                fontSize: "clamp(.85rem, 1.1vw, .95rem)",
                maxWidth: 320,
                lineHeight: 1.6,
                color: "#6f4e37",
              }}
            >
              {work.desc}
            </p>
          </div>
        ))}
      </div>

      {/* ===== Styles ===== */}
      <style>{`
        .work-card{
          border-radius: 12px;
          overflow: hidden;
          transition: transform .35s ease, box-shadow .35s ease;
          background: #fff;
          width: min(100%, 360px);
          aspect-ratio: 4 / 5; /* يحافظ على النسبة عبر كل المقاسات */
        }
        .work-img{
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transform: scale(1);
          transition: transform .45s ease;
          will-change: transform;
        }
        /* Hover للأجهزة التي تدعمه فقط */
        @media (hover: hover) and (pointer: fine){
          .work-card:hover{ transform: translateY(-4px); box-shadow: 0 10px 22px rgba(0,0,0,.10); }
          .work-card:hover .work-img{ transform: scale(1.05); }
        }
        /* تباعد إضافي على الشاشات الصغيرة */
        @media (max-width: 575.98px){
          .work-card{ width: 100%; }
        }
        @media (prefers-reduced-motion: reduce){
          .work-card, .work-img{ transition: none !important; }
        }
      `}</style>
    </section>
  );
}
