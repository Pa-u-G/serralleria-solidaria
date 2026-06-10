import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProductGrid from '../components/productGrid/ProductGrid';
import FiltersSidebar from '../components/filters/FiltersSidebar';
import { allProductsApi } from './services/allProductsApi';
import MainLayout from "../../../layouts/layoutTienda/Main_layout_tienda";
import styles from './Products.module.scss';

const ProductPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [sortBy, setSortBy] = useState('newest');
    const [activeFilters, setActiveFilters] = useState({
        characteristics: [],
        star: false
    });
    const [totalProducts, setTotalProducts] = useState(0);

    useEffect(() => {
        loadProducts();
    }, [activeFilters, sortBy]);

    const loadProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await allProductsApi.getAllProducts({
                ...activeFilters,
                sort_by: sortBy
            });
            setProducts(data.products);
            setTotalProducts(data.total);
        } catch (err) {
            setError('No s\'han pogut carregar els productes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleFilterChange = (filters) => {
        setActiveFilters(filters);
        if (window.innerWidth < 1024) {
            setFiltersVisible(false);
        }
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const getActiveFiltersCount = () => {
        return activeFilters.characteristics.length + (activeFilters.star ? 1 : 0);
    };

    if (loading) {
        return (
            <div className={styles.allProductsPage}>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Carregant productes...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.allProductsPage}>
                <div className={styles.errorContainer}>
                    <div className={styles.errorIcon}>⚠️</div>
                    <h2>Error</h2>
                    <p>{error}</p>
                    <button onClick={handleGoBack} className={styles.backButton}>
                        Tornar enrere
                    </button>
                </div>
            </div>
        );
    }

    return (
        <MainLayout>

            <div className={styles.allProductsPage}>
                <div className={styles.pageContainer}>

                    {/* Barra d'eines */}
                    <div className={styles.toolbar}>
                        <div className={styles.toolbarLeft}>
                            <button 
                                className={styles.filterToggleBtn}
                                onClick={() => setFiltersVisible(true)}
                            >
                                Filtres
                                {getActiveFiltersCount() > 0 && (
                                    <span className={styles.filterBadge}>
                                        {getActiveFiltersCount()}
                                    </span>
                                )}
                            </button>
                            
                            {getActiveFiltersCount() > 0 && (
                                <button 
                                    className={styles.clearFiltersBtn}
                                    onClick={() => handleFilterChange({ characteristics: [], star: false })}
                                >
                                    Netejar filtres
                                </button>
                            )}
                        </div>

                        <div className={styles.toolbarRight}>
                            <label>Ordenar per:</label>
                            <select 
                                value={sortBy} 
                                onChange={handleSortChange}
                                className={styles.sortSelect}
                            >
                                <option value="newest">Més recents</option>
                                <option value="price_asc">Preu: de menor a major</option>
                                <option value="price_desc">Preu: de major a menor</option>
                                <option value="name">Nom: de A a Z</option>
                            </select>
                        </div>
                    </div>

                    {/* Graella de productes */}
                    <ProductGrid 
                        products={products} 
                        emptyMessage="No hi ha productes disponibles"
                    />
                </div>

                {/* Sidebar de filtres */}
                <FiltersSidebar 
                    visible={filtersVisible}
                    onClose={() => setFiltersVisible(false)}
                    onFilterChange={handleFilterChange}
                    selectedFilters={activeFilters}
                />
            </div>
        </MainLayout>

    );
};

export default ProductPage;