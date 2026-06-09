import React from 'react';
import ProductCard from '../productCard/ProductCard';
import styles from './ProductGrid.module.scss';

const ProductGrid = ({ products, emptyMessage = "No hay productos disponibles" }) => {
    if (products.length === 0) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                    <svg>
                        <use href="#icon-box?"></use>
                    </svg>
                </div>
                <h3>{emptyMessage}</h3>
                <p>Pronto tendremos nuevos productos disponibles</p>
            </div>
        );
    } else {
        return (
            <div className={styles.productGrid}>
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        )
    }
};

export default ProductGrid;