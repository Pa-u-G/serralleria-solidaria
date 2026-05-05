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
            setError('No se pudieron cargar los productos');
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
                    <p>Cargando productos...</p>
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
                        Volver atrás
                    </button>
                </div>
            </div>
        );
    }

    return (
        <MainLayout>

            <div className={styles.allProductsPage}>
                <div className={styles.pageContainer}>

                    {/* Barra de herramientas */}
                    <div className={styles.toolbar}>
                        <div className={styles.toolbarLeft}>
                            <button 
                                className={styles.filterToggleBtn}
                                onClick={() => setFiltersVisible(true)}
                            >
                                Filtros
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
                                    Limpiar filtros
                                </button>
                            )}
                        </div>

                        <div className={styles.toolbarRight}>
                            <label>Ordenar por:</label>
                            <select 
                                value={sortBy} 
                                onChange={handleSortChange}
                                className={styles.sortSelect}
                            >
                                <option value="newest">Más recientes</option>
                                <option value="price_asc">Precio: menor a mayor</option>
                                <option value="price_desc">Precio: mayor a menor</option>
                                <option value="name">Nombre: A a Z</option>
                            </select>
                        </div>
                    </div>

                    {/* Filtros activos */}
                    {getActiveFiltersCount() > 0 && (
                        <div className={styles.activeFilters}>
                            <span className={styles.activeFiltersLabel}>Filtros activos:</span>
                            {activeFilters.star && (
                                <span className={styles.filterTag}>
                                    ⭐ Destacados
                                    <button onClick={() => handleFilterChange({ ...activeFilters, star: false })}>×</button>
                                </span>
                            )}
                            {/* Aquí podrías mostrar las características seleccionadas si quieres */}
                        </div>
                    )}

                    {/* Grid de productos */}
                    <ProductGrid 
                        products={products} 
                        emptyMessage="No hay productos que coincidan con los filtros seleccionados"
                    />
                </div>

                {/* Sidebar de filtros */}
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