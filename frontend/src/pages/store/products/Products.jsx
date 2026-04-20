import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { allProductsApi } from './services/allProductsApi';
import MainLayout from "../../../layouts/layoutTienda/Main_layout_tienda";
import ProductGrid from '../components/productGrid/ProductGrid';
import styles from './Products.module.scss';

const Products = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // all, featured, lowStock
    const [sortBy, setSortBy] = useState('newest'); // newest, price_asc, price_desc, name

    useEffect(() => {
        loadAllProducts();
    }, []);

    const loadAllProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await allProductsApi.getAllProducts();
            setProducts(data.products);
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

    // Filtrar productos
    const getFilteredProducts = () => {
        let filtered = [...products];
        

        if (filter === "featured") {
            filtered = filtered.filter(p => p.star === 1);
        } else if (filter === "all") {
            
        } else {
            let caracteristic = filter.split("_")
            console.log(caracteristic)
            
        }
        
        return filtered;
    };
    
    // Ordenar productos
    const getSortedProducts = (productsToSort) => {
        const sorted = [...productsToSort];
        
        switch(sortBy) {
            case 'price_asc':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                sorted.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'newest':
            default:
                sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
        }
        
        return sorted;
    };

    const filteredProducts = getFilteredProducts();
    const sortedProducts = getSortedProducts(filteredProducts);

    if (loading) {
        return (
            <div className={styles.productsPage}>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Cargando productos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.productsPage}>
                <div className={styles.errorContainer}>
                    <div className={styles.errorIcon}>⚠️</div>
                    <h2>Error</h2>
                    <p>{error}</p>
                    <button onClick={handleGoBack} className={styles.backButton}>
                        Volver atrás
                    </button>
                </div>
            </div>
        );
    }

    return (
        <MainLayout>

            <div className={styles.productsPage}>
                <div className={styles.pageContainer}>
                    {/* Header */}
                    <div className={styles.pageHeader}>
                        <button onClick={handleGoBack} className={styles.backButton}>
                            ← Volver
                        </button>
                        <div className={styles.headerInfo}>
                            <h1>Todos los Productos</h1>
                            <p className={styles.productCount}>
                                {sortedProducts.length} {sortedProducts.length === 1 ? 'producto' : 'productos'} disponibles
                            </p>
                        </div>
                    </div>

                    {/* Filtros y ordenación */}
                    <div className={styles.filtersSection}>
                        <div className={styles.filterGroup}>
                            <label>Filtrar por:</label>
                            <div className={styles.filterButtons}>
                                <button 
                                    className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
                                    onClick={() => setFilter('all')}
                                >
                                    Todos
                                </button>
                                <button 
                                    className={`${styles.filterBtn} ${filter === 'featured' ? styles.active : ''}`}
                                    onClick={() => setFilter('featured')}
                                >
                                    Destacados
                                </button>
                                <button 
                                    className={`${styles.filterBtn} ${filter === 'lowStock' ? styles.active : ''}`}
                                    onClick={() => setFilter('4')}
                                >
                                    aa
                                </button>
                            </div>
                        </div>

                        <div className={styles.sortGroup}>
                            <label>Ordenar por:</label>
                            <select 
                                value={sortBy} 
                                onChange={(e) => setSortBy(e.target.value)}
                                className={styles.sortSelect}
                            >
                                <option value="newest">Más recientes</option>
                                <option value="price_asc">Precio: menor a mayor</option>
                                <option value="price_desc">Precio: mayor a menor</option>
                                <option value="name">Nombre: A a Z</option>
                            </select>
                        </div>
                    </div>

                    {/* Grid de productos (reutilizado) */}
                    <ProductGrid 
                        products={sortedProducts} 
                        emptyMessage="No hay productos que coincidan con los filtros"
                    />
                </div>
            </div>
        </MainLayout>
    );
};

export default Products;