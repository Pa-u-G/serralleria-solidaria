import React, { useState } from 'react';
import ProductCard from '../productCard/ProductCard';
import styles from './Carousel.module.scss';

const ProductCarousel = ({ products, limit = 10 }) => {
    const limitedProducts = products.slice(0, limit);

    const [index, setIndex] = useState(0);

    const itemsPerView = 3;

    const maxIndex =
        Math.ceil(limitedProducts.length / itemsPerView) - 1;

    const next = () => {
        setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    };

    const prev = () => {
        setIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    };

    return (
        <div className={styles.productCarousel}>
            <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prev}>
                ❮
            </button>

            <div className={styles.carouselContainer}>
                <div
                    className={styles.carouselTrack}
                    style={{
                        transform: `translateX(-${index * (100)}%)`
                    }}
                >
                    {limitedProducts.map(product => (
                        <div key={product.id} className={styles.carouselItem}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>

            <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={next}>
                ❯
            </button>
        </div>
    );
};

export default ProductCarousel;