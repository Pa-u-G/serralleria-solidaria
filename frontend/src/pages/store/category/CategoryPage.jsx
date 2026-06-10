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
            setError('No s\'ha pogut carregar la informació de la categoria');
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
        // Tancar sidebar en mòbil després d'aplicar filtres
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
                    <p>Carregant productes...</p>
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
                    <p>{error || 'Categoria no trobada'}</p>
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
            <div className={`${styles.categoryPage}`}>
                {/* Capçalera de la categoria */}
                <div className={styles.categoryHeader}>
                    {/* <button onClick={handleGoBack} className={styles.backButton}>
                        ← Tornar
                    </button> */}
                    <div className={styles.categoryInfo}>
                        <h1>{category.name}</h1>
                        <p className={styles.productCount}>
                            {products.length} {products.length === 1 ? 'producte' : 'productes'} disponibles
                        </p>
                    </div>

                    {/* Barra d'eines */}
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
                                    Netejar filtres
                                </button>
                            )}
                        </div>

                        <div className={styles.toolbarRight}>
                            <label htmlFor="sort-select">Ordenar per:</label>
                            <select 
                                id="sort-select"
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
                    {loading ? (
                        <div className={styles.loadingProducts}>
                            <div className={styles.spinner}></div>
                            <p>Carregant productes...</p>
                        </div>
                    ) : (
                        <ProductGrid 
                            products={products} 
                            emptyMessage="No hi ha productes disponibles"
                        />
                    )}
                </div>

                {/* Sidebar de filtres */}
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