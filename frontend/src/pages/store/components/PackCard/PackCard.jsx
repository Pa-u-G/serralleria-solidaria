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

    const handleClick = () => {
        navigate(`/store/pack/${pack.id}`);
    };

    // Obtener primera imagen si existe
    const firstImage = pack.images && pack.images.length > 0 ? pack.images[0] : null;

    return (
        <div className={styles.packCard} onClick={handleClick}>
            <div className={styles.packImage}>
                {!imageError && firstImage ? (
                    <img 
                        src={firstImage.path} 
                        alt={pack.name}
                        onError={() => setImageError(true)}
                        className={styles.image}
                    />
                ) : (
                    <div className={styles.imagePlaceholder}>
                        📦 Pack
                    </div>
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
                    </div>
                    <div className={styles.productCount}>
                        {pack.products?.length || 0} productos
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackCard;