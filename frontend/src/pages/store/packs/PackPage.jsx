import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PackProductItem from './components/PackProductItem';
import { packApi } from './services/packApi';
import styles from './PackPage.module.scss';
import MainLayout from "../../../layouts/layoutTienda/Main_layout_tienda";
import { useAddToCart } from '../../../hooks/useAddToCart';

const PackPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pack, setPack] = useState(null);
    const [totalIndividualPrice, setTotalIndividualPrice] = useState(0);
    const [savings, setSavings] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const { handleAddToCart } = useAddToCart();


    useEffect(() => {
        if (id) {
            loadPack(id);
        }
    }, [id]);

    const loadPack = async (packId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await packApi.getPack(packId);
            setPack(data.pack);
            setTotalIndividualPrice(data.total_individual_price);
            setSavings(data.savings);
        } catch (err) {
            setError('No s\'ha pogut carregar el pack');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (value >= 1 && value <= 10) {
            setQuantity(value);
        }
    };

    const incrementQuantity = () => {
        if (quantity < 10) {
            setQuantity(quantity + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleAddToCartClick = async () => {
        await handleAddToCart('pack', pack.id, quantity);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    };

    const calculateTotal = () => {
        return pack.price * quantity;
    };

    if (loading) {
        return (
            <MainLayout>
                <div className={styles.packPage}>
                    <div className={styles.skeleton}>
                        <div className={styles.skeletonImage}></div>
                        <div className={styles.skeletonInfo}>
                            <div className={styles.skeletonTitle}></div>
                            <div className={styles.skeletonPrice}></div>
                            <div className={styles.skeletonText}></div>
                            <div className={styles.skeletonText}></div>
                            <div className={styles.skeletonButton}></div>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (error || !pack) {
        return (
            <MainLayout>
                <div className={styles.packPage}>
                    <div className={styles.errorContainer}>
                        <div className={styles.errorIcon}>⚠️</div>
                        <h2>Pack no trobat</h2>
                        <p>{error || 'El pack que busques no existeix o no està disponible'}</p>
                        <button onClick={handleGoBack} className={styles.backButton}>
                            Tornar enrere
                        </button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className={styles.packPage}>
                <div className={styles.packContainer}>
                    {/* Botó tornar */}
                    <button onClick={handleGoBack} className={styles.backButton}>
                        ← Tornar
                    </button>

                    {/* Contingut principal */}
                    <div className={styles.packContent}>
                        {/* Galeria d'imatges */}
                        <div className={styles.packGallery}>
                            <div className={styles.mainImage}>
                                
                                {pack.images[0] ? (
                                    <img 
                                        src={`http://localhost:8000/storage/${pack.images[selectedImage].path}`}
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
                                )}
                            </div>
                            {pack.images && pack.images.length > 1 && (
                                <div className={styles.thumbnailList}>
                                    {pack.images.map((img, index) => (
                                        <button
                                            key={index}
                                            className={`${styles.thumbnail} ${selectedImage === index ? styles.active : ''}`}
                                            onClick={() => setSelectedImage(index)}
                                        >
                                            <img src={`http://localhost:8000/storage/${pack.images[index].path}`} alt={`${pack.name} - ${index + 1}`} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Informació del pack */}
                        <div className={styles.packInfo}>
                            
                            <h1 className={styles.packTitle}>{pack.name}</h1>

                            <div className={styles.priceSection}>
                                <div className={styles.packPrice}>
                                    {formatPrice(calculateTotal())}
                                </div>
                                {quantity === 1 && savings > 0 && (
                                    <div className={styles.savingsBadge}>
                                        Estalvia {formatPrice(savings)}
                                    </div>
                                )}
                            </div>

                            {savings > 0 && quantity === 1 && (
                                <div className={styles.priceComparison}>
                                    <span className={styles.originalPrice}>
                                        Valor original: {formatPrice(totalIndividualPrice)}
                                    </span>
                                    <span className={styles.savingsText}>
                                        Estalvi del {Math.round((savings / totalIndividualPrice) * 100)}%
                                    </span>
                                </div>
                            )}

                            <div className={styles.packDescription}>
                                <h3>Descripció del Pack</h3>
                                <p>{pack.description}</p>
                            </div>

                            <div className={styles.packIncluded}>
                                <h3>Productes inclosos</h3>
                                <div className={styles.productsList}>
                                    {pack.products.map((product) => (
                                        <PackProductItem 
                                            key={product.id}
                                            product={product}
                                            amount={product.pivot.amount}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className={styles.purchaseSection}>
                                <div className={styles.quantitySelector}>
                                    <label for="quantity">Quantitat de packs:</label>
                                    <div className={styles.quantityControls}>
                                        <button 
                                            onClick={decrementQuantity}
                                            disabled={quantity <= 1}
                                            className={styles.quantityBtn}
                                        >
                                            -
                                        </button>
                                        <input
                                            id="quantity"
                                            name="quantity"
                                            type="number"
                                            value={quantity}
                                            onChange={handleQuantityChange}
                                            min="1"
                                            max="10"
                                            className={styles.quantityInput}
                                        />
                                        <button 
                                            onClick={incrementQuantity}
                                            disabled={quantity >= 10}
                                            className={styles.quantityBtn}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleAddToCartClick}
                                    className={`${styles.addToCartBtn} ${addedToCart ? styles.added : ''}`}
                                >
                                    {addedToCart ? '✓ Afegit al carro' : 'Afegir pack al carro'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default PackPage;