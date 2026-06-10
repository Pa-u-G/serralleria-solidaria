import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, redirect, redirectDocument } from 'react-router-dom';
import { productApi } from './services/productApi';
import styles from './ProductPage.module.scss';
import MainLayout from "../../../layouts/layoutTienda/Main_layout_tienda";
import axios from "axios";
import { useAddToCart } from '../../../hooks/useAddToCart';


const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const { handleAddToCart } = useAddToCart();

    useEffect(() => {
        if (id) {
            loadProduct(id);
        }
    }, [id]);

    const loadProduct = async (productId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await productApi.getProduct(productId);
            setProduct(data);
        } catch (err) {
            setError('No s\'ha pogut carregar el producte');
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
        if (value >= 1 && value <= (product?.stock || 10)) {
            setQuantity(value);
        }
    };

    const incrementQuantity = () => {
        if (quantity < product.stock) {
            setQuantity(quantity + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleAddToCartClick = async () => {
        await handleAddToCart('product', product.id, quantity);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };


    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    };

    if (loading) {
        return (
            <div className={styles.productPage}>
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
        );
    }
    if (error || !product) {
        navigate("/")
    } else {
        
        return (
            <MainLayout>
                
                <div className={styles.productPage}>
                    <div className={styles.productContainer}>
                        {/* Botó tornar */}
                        <button onClick={handleGoBack} className={styles.backButton}>
                            ← Tornar
                        </button>
    
                        {/* Contingut principal */}
                        <div className={styles.productContent}>
                            {/* Galeria d'imatges */}
                            <div className={styles.productGallery}>
                                <div className={styles.mainImage}>
                                    {product.images[selectedImage] ? 
                                        <img src={`http://localhost:8000/storage/${product.images[selectedImage].path}`} alt={product.name} /> :
                                        <div className={styles.imagePlaceholder}>
                                            <svg>
                                                <use href="#icon-box?"></use>
                                            </svg>
                                        </div>
                                    }
                                </div>
                                {product.images && product.images.length > 1 && (
                                    <div className={styles.thumbnailList}>
                                        {product.images.map((img, index) => (
                                            <button
                                                key={index}
                                                className={`${styles.thumbnail} ${selectedImage === index ? styles.active : ''}`}
                                                onClick={() => setSelectedImage(index)}
                                            >
                                                <img src={`http://localhost:8000/storage/${img.path}`} alt={`${product.name} - ${index + 1}`} />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
    
                            {/* Informació del producte */}
                            <div className={styles.productInfo}>
                                {product.star ? (
                                    <div className={styles.starBadge}>
                                        Producte Destacat
                                    </div>
                                ): ""}
                                
                                <h1 className={styles.productTitle}>{product.name}</h1>
                                
                                <div className={styles.productMeta}>
                                    <span className={styles.productCode}>Codi: {product.code}</span>
                                    <span className={styles.productCategory}>
                                        Categoria: {product.category?.name}
                                    </span>
                                </div>
    
                                <div className={styles.productPrice}>
                                    {formatPrice(product.price)}
                                </div>
    
                                <div className={styles.stockInfo}>
                                    {product.stock > 0 ? (
                                        <>
                                            <span className={styles.inStock}>✓ En estoc</span>
                                            {product.stock < 10 && (
                                                <span className={styles.lowStockWarning}>
                                                    Últimes {product.stock} unitats!
                                                </span>
                                            )}
                                        </>
                                    ) : (
                                        <span className={styles.outOfStock}>✗ Esgotat</span>
                                    )}
                                </div>
    
                                <div className={styles.productDescription}>
                                    <h3>Descripció</h3>
                                    <p>{product.description}</p>
                                </div>
    
                                {product.characteristics && product.characteristics.length > 0 && (
                                    <div className={styles.productCharacteristics}>
                                        <h3>Característiques</h3>
                                        <ul>
                                            {product.characteristics.map((char, index) => ( 
                                                <li key={index}>
                                                    <span className={styles.charName}>{char.type.type}:</span>
                                                    <span className={styles.charValue}>{char.description}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
    
                                {product.stock > 0 && (
                                    <div className={styles.purchaseSection}>
                                        <div className={styles.quantitySelector}>
                                            <label for="quantity">Quantitat:</label>
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
                                                    max={product.stock}
                                                    className={styles.quantityInput}
                                                />
                                                <button 
                                                    onClick={incrementQuantity}
                                                    disabled={quantity >= product.stock}
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
                                            {addedToCart ? '✓ Afegit al carro' : 'Afegir al carro'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

};

export default ProductPage;