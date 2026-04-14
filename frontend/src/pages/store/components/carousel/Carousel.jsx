import React, { useRef, useEffect } from 'react';
import ProductCard from '../productCard/ProductCard';
import styles from './Carousel.module.scss';

const ProductCarousel = ({ products, limit = 10 }) => {
    const carouselRef = useRef(null);
    const limitedProducts = products.slice(0, limit);

    const scroll = (direction) => {
        const scrollAmount = 350;
        carouselRef.current.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
    };

    const handleWheel = (e) => {
        e.preventDefault();
        carouselRef.current.scrollLeft += e.deltaY;
    };

    useEffect(() => {
        const carousel = carouselRef.current;
        if (carousel) {
            carousel.addEventListener('wheel', handleWheel, { passive: false });
        }
    }, []);

    return (
        <div className={styles.productCarousel}>
            <div className={styles.divButtons}>
                <button 
                    className={`${styles.arrow} ${styles.arrowLeft}`}
                    onClick={() => scroll('left')}
                >
                    ❮
                </button>
                <button 
                    className={`${styles.arrow} ${styles.arrowRight}`}
                    onClick={() => scroll('right')}
                >
                    ❯
                </button>
            </div>
            
            <div className={styles.carouselContainer} ref={carouselRef}>
                <div className={styles.carouselTrack}>
                    {limitedProducts.map(product => (
                        <div key={product.id} className={styles.carouselItem}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
            
            
        </div>
    );
};

export default ProductCarousel;