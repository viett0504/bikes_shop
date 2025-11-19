import React, { useEffect, useMemo, useState } from "react";
import "../../pages/Home/HomePage.css";
import { getHeroBanners } from "./FetchApi"
const HeroSection = () => {
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);

  // Load list banner từ BE
  useEffect(() => {
    (async () => {
      try {
        const urls = await getHeroBanners();
        setImages(urls);
      } catch (e) {
        console.error("Load banners error:", e);
        setImages([]);
      }
    })();
  }, []);

  // Auto slide
  useEffect(() => {
    if (!images.length) return;
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(id);
  }, [images]);

  const hasImages = images.length > 0;

  const imgSrc = useMemo(
    () => (hasImages ? images[current] : ""),
    [images, current, hasImages]
  );

  const nextSlide = () =>
    hasImages && setCurrent((p) => (p + 1) % images.length);

  const prevSlide = () =>
    hasImages && setCurrent((p) => (p - 1 + images.length) % images.length);

  return (
    <section className="hero">
      {hasImages ? (
        <img src={imgSrc} alt="Banner" className="hero-image" />
      ) : (
        <div className="hero-image skeleton" />
      )}

      {/* Nút chuyển slide */}
      <button className="nav-button left" onClick={prevSlide}>
        &#10094;
      </button>

      <button className="nav-button right" onClick={nextSlide}>
        &#10095;
      </button>

      {/* Dots */}
      <div className="dots">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`dot ${idx === current ? "active" : ""}`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
