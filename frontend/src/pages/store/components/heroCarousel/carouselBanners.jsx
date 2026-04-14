import React, { useState } from "react";
import styles from "./carouselBanners.module.scss";

const BannerCarousel = ({ banners = [] }) => {
    const [index, setIndex] = useState(0);

    const total = banners.length;

    const next = () => {
        setIndex((prev) => (prev + 1) % total);
    };

    const prev = () => {
        setIndex((prev) => (prev - 1 + total) % total);
    };

    const getPosition = (i) => {
        if (!total) return 0;
        return (i - index + total) % total;
    };

    return (
        <div className={styles.carousel}>

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
                            <img src={banner.url} alt="" />
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