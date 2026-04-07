import React, { useState } from 'react';
import styles from '../styles/ProductCard.module.scss';

const ProductCard = ({ product }) => {
    const [imageError, setImageError] = useState(false);
    
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    };

    const getStockStatus = () => {
        if (product.stock <= 0) return { text: 'Agotado', class: styles.outOfStock };
        if (product.stock < 10) return { text: `Últimas ${product.stock} unidades`, class: styles.lowStock };
        return { text: `Stock: ${product.stock}`, class: styles.inStock };
    };

    const stockStatus = getStockStatus();

    return (
        <div className={styles.productCard}>
            {product.star && (
                <div className={styles.starBadge}>
                    ⭐ Destacado
                </div>
            )}
            
            <div className={styles.productImage}>
                {!imageError ? (
                    <img 
                        src={`http://localhost:8000/storage/${product.images[0].path}`}
                        alt={product.name}
                        onError={() => setImageError(true)}
                        className={styles.image}
                    />
                ) : (
                    <div className={styles.imagePlaceholder}>
                        📦
                    </div>
                )}
            </div>
            
            <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productCode}>Ref: {product.code}</p>
                <p className={styles.productDescription}>
                    {product.description.length > 120 
                        ? `${product.description.substring(0, 120)}...` 
                        : product.description}
                </p>
                
                <div className={styles.productFooter}>
                    <div className={styles.priceSection}>
                        <span className={styles.productPrice}>
                            {formatPrice(product.price)}
                        </span>
                        {product.stock > 0 && (
                            <button className={styles.addToCart}>
                                Añadir al carrito
                            </button>
                        )}
                    </div>
                    <div className={`${styles.stockStatus} ${stockStatus.class}`}>
                        {stockStatus.text}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;