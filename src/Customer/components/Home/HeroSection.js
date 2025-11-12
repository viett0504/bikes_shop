import React, { useState } from "react";
import '../../pages/Home/HomePage.css';
import banner1 from "../../../assets/img/banner1.webp";   
import banner2 from "../../../assets/img/banner2.webp";   
import banner3 from "../../../assets/img/banner3.webp";   

const images = [banner1, banner2, banner3];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section className="hero">
      <img src={images[current]} alt="Banner" className="hero-image" />

      {/* Nút trái */}
      <button className="nav-button left" onClick={prevSlide}>
        &#10094;
      </button>

      {/* Nút phải */}
      <button className="nav-button right" onClick={nextSlide}>
        &#10095;
      </button>

      {/* Dấu chấm trượt */}
      <div className="dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === current ? "active" : ""}`}
            onClick={() => setCurrent(index)}
          ></span>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
