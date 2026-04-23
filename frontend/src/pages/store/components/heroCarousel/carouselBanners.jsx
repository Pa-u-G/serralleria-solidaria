import React, { useState, useEffect } from "react";
import styles from "./carouselBanners.module.scss";
import { useNavigate } from "react-router-dom";

const BannerCarousel = ({ banners = [] }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const total = banners.length;

  // Detectar si és mòbil per l'amplada
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const next = () => {
    setIndex((prev) => (prev + 1) % total);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + total) % total);
  };

  useEffect(() => {
    let interval;

    if (total > 0 && !isPaused && !isMobile) {
      interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % total);
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [index, total, isPaused, isMobile]);

  const getPosition = (i) => {
    return (i - index + total) % total;
  };

  // En mòbil, mostrar només el banner de solucions (id:2)
  if (isMobile) {
    const solutionBanner = banners.find(b => b.id === 2);
    
    if (!solutionBanner) return null;
    
    return (
      <div className={styles.mobileBanner}>
        <div className={styles.mobileBannerContent}>
          <img src={solutionBanner.image} alt={solutionBanner.title} />
          <div className={styles.overlay}>
            <div className={styles.content}>
              <h2>{solutionBanner.title}</h2>
              <p>{solutionBanner.subtitle}</p>
              <button onClick={() => navigate(solutionBanner.link)}>
                {solutionBanner.button}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={styles.carousel}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <button className={styles.arrowLeft} onClick={prev}>
        ❮
      </button>

      <div className={styles.track}>
        {banners.map((banner, i) => {
          const position = getPosition(i);

          return (
            <div
              key={banner.id}
              className={`${styles.slide} ${
                position === 0
                  ? styles.center
                  : position === 1
                  ? styles.right
                  : position === total - 1
                  ? styles.left
                  : styles.hidden
              }`}
            >
              <img src={banner.image} alt="" />

              {banner.title && (
                <div className={styles.overlay}>
                  <div className={styles.content}>
                    <h2>{banner.title}</h2>
                    <p>{banner.subtitle}</p>
                    <button onClick={() => navigate(banner.link)}>
                      {banner.button}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button className={styles.arrowRight} onClick={next}>
        ❯
      </button>
    </div>
  );
};

export default BannerCarousel;