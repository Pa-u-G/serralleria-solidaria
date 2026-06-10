import React, { useState } from 'react';
import styles from './ProductCard.module.scss';
import { useNavigate } from "react-router-dom";
import { useAddToCart } from '../../../../hooks/useAddToCart';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const [imageError, setImageError] = useState(false);
    const { handleAddToCart } = useAddToCart();
    const [addedToCart, setAddedToCart] = useState(false);

    
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    };

    const getStockStatus = () => {
        if (product.stock <= 0) return { text: 'Esgotat', class: styles.outOfStock };
        if (product.stock < 10) return { text: `Últimes ${product.stock} unitats`, class: styles.lowStock };
        return { text: `Estoc: ${product.stock}`, class: styles.inStock };
    };

    const onAddToCart = async (e) => {
        e.stopPropagation(); // evita navegar a la pàgina del producte
        await handleAddToCart('product', product.id, 1);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };


    const stockStatus = getStockStatus();

    return (
        <div className={styles.productCard} onClick={() => navigate(`/product/${product.id}`)}>
            {product.star ? (
                <div className={styles.starBadge}>
                    Destacat
                </div>
            ) : (
                ""
            )}
            
            <div className={styles.productImage}>
                { product.images[0] ? (
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
                            <button
                                className={`${styles.addToCart} ${addedToCart ? styles.added : ''}`}
                                onClick={onAddToCart}
                            >
                                {addedToCart ? '✓ Afegit' : 'Afegir al carro'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;