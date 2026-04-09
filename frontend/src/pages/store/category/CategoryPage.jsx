import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductGrid from '../components/productGrid/ProductGrid';
import { categoryApi } from './services/categoryApi';
import styles from './CategoryPage.module.scss';
import MainLayout from "../../../layouts/layoutTienda/Main_layout_tienda";

const CategoryPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            loadCategoryData(id);
        }
    }, [id]);

    const loadCategoryData = async (categoryId) => {
        setLoading(true);
        setError(null);
        
        try {
            // Cargar información de la categoría y productos en paralelo
            const [categoryData, productsData] = await Promise.all([
                categoryApi.getCategoryInfo(categoryId),
                categoryApi.getProductsByCategory(categoryId)
            ]);
            
            setCategory(categoryData);
            setProducts(productsData.products);
        } catch (err) {
            setError('No se pudieron cargar los productos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <div className={styles.categoryPage}>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Cargando productos...</p>
                </div>
            </div>
        );
    }

    if (error || !category) {
        return (
            <div className={styles.categoryPage}>
                <div className={styles.errorContainer}>
                    <div className={styles.errorIcon}>⚠️</div>
                    <h2>Error</h2>
                    <p>{error || 'Categoría no encontrada'}</p>
                    <button onClick={handleGoBack} className={styles.backButton}>
                        Volver atrás
                    </button>
                </div>
            </div>
        );
    }

    return (
        <MainLayout>
            <div className={`${styles.categoryPage}`}>
                {/* Header de la categoría */}
                <div className={styles.categoryHeader}>
                    {/* <button onClick={handleGoBack} className={styles.backButton}>
                        ← Volver
                    </button> */}
                    <div className={styles.categoryInfo}>
                        <h1>{category.name}</h1>
                        <p className={styles.productCount}>
                            {products.length} {products.length === 1 ? 'producto' : 'productos'} disponibles
                        </p>
                    </div>
                </div>

                {/* Grid de productos */}
                {products.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={`${styles.emptyIcon} category-box`}>
                            <svg>
                                <use href="#icon-box?"></use>
                            </svg>
                        </div>
                        <h3>No hay productos disponibles</h3>
                        <p>Pronto tendremos nuevos productos en esta categoría</p>
                    </div>
                ) : (
                    <ProductGrid products={products} />
                )}
            </div>
        </MainLayout>
    );
};

export default CategoryPage;