import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PackProductItem.module.scss';

const PackProductItem = ({ product, amount }) => {
    const navigate = useNavigate();
    const [imageError, setImageError] = useState(false);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    };

    const handleProductClick = () => {
        navigate(`/product/${product.id}`);
    };

    const firstImage = product.images && product.images.length > 0 ? product.images[0] : null;

    return (
        <div className={styles.packProductItem} onClick={handleProductClick}>
            <div className={styles.productImage}>
                {product.images[0] ? (
                    <img 
                        src={`http://localhost:8000/storage/${product.images[0].path}`}
                        alt={product.name}
                        onError={() => setImageError(true)}
                        className={styles.image}
                    />
                ) : (
                    <div className={styles.imagePlaceholder}>
                        <svg>
                            <use href="#icon-box?"></use>
                        </svg>
                    </div>
                )}
            </div>
            
            <div className={styles.productInfo}>
                <h4 className={styles.productName}>{product.name}</h4>
                <p className={styles.productCategory}>{product.category?.name}</p>
                <div className={styles.productDetails}>
                    <span className={styles.productAmount}>Cantidad: {amount}</span>
                    <span className={styles.productPrice}>{formatPrice(product.price)} c/u</span>
                    <div className={styles.productSubtotal}>
                        Subtotal: {formatPrice(product.price * amount)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackProductItem;