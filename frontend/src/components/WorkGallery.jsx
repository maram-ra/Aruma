import React from "react";

export default function WorkGallery() {
  const works = [
    {
      img: "/images/work1.jpg",
      title: "Lapis Stud",
      desc: "Minimal handcrafted stud inspired by desert tones.",
    },
    {
      img: "/images/work2.jpg",
      title: "Vintage Fetish Bear Necklace",
      desc: "A unique silver necklace reflecting heritage and craftsmanship.",
    },
    {
      img: "/images/work3.jpg",
      title: "Lapis Stud",
      desc: "Elegant lapis design with a modern minimal touch.",
    },
    {
      img: "/images/work4.jpg",
      title: "Vintage Turquoise Ring",
      desc: "Classic turquoise ring blending traditional and modern aesthetics.",
    },
    {
      img: "/images/work5.jpg",
      title: "Misawa Mini Hoop Earrings - Pair",
      desc: "Small hoops inspired by natural textures and simple forms.",
    },
    {
      img: "/images/work6.jpg",
      title: "Bonnie Bracelet",
      desc: "Delicate bracelet crafted to represent balance and movement.",
    },
  ];

  return (
    <section className="container py-5 text-center">
      {/* ===== Section Title ===== */}
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

      {/* ===== Image Grid ===== */}
      <div className="row justify-content-center" style={{ rowGap: "60px" }}>
        {works.map((work, index) => (
          <div
            className="col-12 col-sm-6 col-md-4 d-flex flex-column align-items-center"
            key={index}
            style={{
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
          >
            {/* الصورة */}
            <div
              className="overflow-hidden"
              style={{
                borderRadius: "10px",
                boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease",
              }}
            >
              <img
                src={work.img}
                alt={work.title}
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

            {/* النص تحت الصورة */}
            <h6
              className="fw-semibold mt-3 mb-1"
              style={{
                color: "#3a0b0b",
                fontSize: "1rem",
                transition: "color 0.2s ease",
              }}
            >
              {work.title}
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
              {work.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
