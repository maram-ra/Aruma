import React from "react";

export default function WorkGallery() {
  const works = [
    { img: "/images/work1.jpg", title: "Lapis Stud" },
    { img: "/images/work2.jpg", title: "Vintage Fetish Bear Necklace" },
    { img: "/images/work3.jpg", title: "Lapis Stud" },
    { img: "/images/work4.jpg", title: "Vintage Turquoise Ring" },
    { img: "/images/work5.jpg", title: "Misawa Mini Hoop Earrings - Pair" },
    { img: "/images/work6.jpg", title: "Bonnie Bracelet" },
  ];
  return (
    <section className="container py-5 text-center">
      {/* ===== Section Title ===== */}
      <h5 className="mb-4" style={{ color: "#3a0b0b" }}>
        My Work
      </h5>

      {/* ===== Image Grid ===== */}
      <div className="row justify-content-center" style={{ rowGap: "40px" }}>
        {works.map((work, index) => (
          <div
            className="col-12 col-md-4 d-flex flex-column align-items-center"
            key={index}
          >
            {/* الصورة */}
            <img
              src={work.img}
              alt={work.title}
              style={{
                width: "100%",
                maxWidth: "340px",
                height: "430px",
                objectFit: "cover",
                borderRadius: "0",
              }}
            />
            {/* النص تحت الصورة */}
                      <p
            className="mb-0"
            style={{
              color: "#3a0b0b",
              fontSize: "0.9rem",
              fontWeight: "600",
              textAlign: "center",
             
            }}
          >
            {work.title}
          </p>

          </div>
        ))}
      </div>
    </section>
  );
}
