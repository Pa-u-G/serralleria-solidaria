import React from 'react';
import ProductCard from '../productCard/ProductCard';
import styles from './ProductGrid.module.scss';

const ProductGrid = ({ products }) => {
    return (
        <div className={styles.productGrid}>
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductGrid;