import React, { useState, useEffect } from "react";
import styles from "./carouselBanners.module.scss";
import { useNavigate } from "react-router-dom";

const BannerCarousel = ({ banners = [] }) => {
      const navigate = useNavigate();
    const [index, setIndex] = useState(1);
    const [isPaused, setIsPaused] = useState(false);

    const total = banners.length;

    const next = () => {
        setIndex((prev) => (prev + 1) % total);
    };

    const prev = () => {
        setIndex((prev) => (prev - 1 + total) % total);
    };

    useEffect(() => {
        let interval;

        if (total > 0 && !isPaused) {
            interval = setInterval(() => {
                setIndex((prev) => (prev + 1) % total);
            }, 5000);
        }

        return () => clearInterval(interval);
    }, [index, total, isPaused]);

    const getPosition = (i) => {
        return (i - index + total) % total;
    };

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

                            {/* 🔥 SOLO SI EXISTE OVERLAY */}
                            {banner.title && (
                                <div className={styles.overlay}>
                                    <div className={styles.content}>
                                        <h2>{banner.title}</h2>
                                        <p>{banner.subtitle}</p>

                                        <button onClick={() => navigate(banner.link)} >
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