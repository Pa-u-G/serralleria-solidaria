import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductGrid from '../components/productGrid/ProductGrid';
import FiltersSidebar from '../components/filters/FiltersSidebar';
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
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [sortBy, setSortBy] = useState('newest');
    const [activeFilters, setActiveFilters] = useState({
        characteristics: [],
        star: false
    });
    const [totalProducts, setTotalProducts] = useState(0);

    useEffect(() => {
        if (id) {
            loadCategoryData(id);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            loadProducts();
        }
    }, [id, activeFilters, sortBy]);

    const loadCategoryData = async (categoryId) => {
        try {
            const categoryData = await categoryApi.getCategoryInfo(categoryId);
            setCategory(categoryData);
        } catch (err) {
            setError('No se pudo cargar la información de la categoría');
            console.error(err);
        }
    };

    const loadProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await categoryApi.getProductsByCategory(id, {
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
        // Cerrar sidebar en móvil después de aplicar filtros
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

    if (loading && !category) {
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
        <MainLayout>
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
        </MainLayout>
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

                    {/* Barra de herramientas */}
                    <div className={styles.toolbar}>
                        <div className={styles.toolbarLeft}>
                            <button 
                                className={styles.filterToggleBtn}
                                onClick={() => setFiltersVisible(true)}
                            >
                                Filtrar
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
                            {activeFilters.characteristics.length > 0 && (
                                <span className={styles.filterTag}>
                                    {activeFilters.characteristics.length} características seleccionadas
                                    <button onClick={() => handleFilterChange({ ...activeFilters, characteristics: [] })}>×</button>
                                </span>
                            )}
                        </div>
                    )}

                    {/* Grid de productos */}
                    {loading ? (
                        <div className={styles.loadingProducts}>
                            <div className={styles.spinner}></div>
                            <p>Cargando productos...</p>
                        </div>
                    ) : (
                        <ProductGrid 
                            products={products} 
                            emptyMessage="No hay productos que coincidan con los filtros seleccionados"
                        />
                    )}
                </div>

                {/* Sidebar de filtros */}
                <FiltersSidebar 
                    visible={filtersVisible}
                    onClose={() => setFiltersVisible(false)}
                    onFilterChange={handleFilterChange}
                    selectedFilters={activeFilters}
                    showStarFilter={true}
                />
            </div>
        </MainLayout>
    );
};

export default CategoryPage;