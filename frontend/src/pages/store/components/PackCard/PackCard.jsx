import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PackCard.module.scss';

const PackCard = ({ pack }) => {
    const navigate = useNavigate();
    const [imageError, setImageError] = useState(false);
    
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    };

    const getStock = (products) => {
        let stock = products[0]? products[0].stock : 0
        products.forEach(product => {
            if (product.stock < stock){
                if (product.stock >= product.pivot.amount) {
                    stock = product.stock
                } else {
                    stock = 0
                }
            }
        });
        return stock
    }

    const getProductImage = (products) => {
        let index = -1;

        products.forEach((product, i) => {
            console.log(product.name)
            console.log(product.images)
            if (product.images && product.images.length > 0 && index === -1) {
                index = i;
            }
        });

        return index;
    }

    const handleClick = () => {
        navigate(`/pack/${pack.id}`);
    };

    // Obtener primera imagen si existe
    const firstImage = pack.images && pack.images.length > 0 ? pack.images[0] : null;
    const p_img = getProductImage(pack.products)
    
    return (
        <div className={styles.packCard} onClick={handleClick}>
            <div className={styles.packImage}>
                {pack.images?.[0] ? (
                    <img 
                        src={`http://localhost:8000/storage/${pack.images[0].path}`}
                        alt={pack.name}
                        onError={() => setImageError(true)}
                        className={styles.image}
                    />
                ) : (
                    p_img !== -1 ? (
                        <img 
                            src={`http://localhost:8000/storage/${pack.products[p_img].images[0].path}`}
                            alt={pack.name}
                            onError={() => setImageError(true)}
                            className={styles.image}
                        />
                    ) : (
                        <div className={styles.imagePlaceholder}>
                            <svg>
                                <use href="#icon-box?"></use>
                            </svg>
                        </div>
                    )
                )}
            </div>
            
            <div className={styles.packInfo}>
                <h3 className={styles.packName}>{pack.name}</h3>
                <p className={styles.packDescription}>
                    {pack.description.length > 100 
                        ? `${pack.description.substring(0, 100)}...` 
                        : pack.description}
                </p>
                
                <div className={styles.packFooter}>
                    <div className={styles.priceSection}>
                        <span className={styles.packPrice}>
                            {formatPrice(pack.price)}
                        </span>
                        {getStock(pack.products) > 0 && (
                            <button className={styles.addToCart}>
                                Añadir al carrito
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackCard;