import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PackGrid from '../components/PackGrid/PackGrid';
import { packsApi } from './services/packsApi';
import styles from './PacksPage.module.scss';
import MainLayout from "../../../layouts/layoutTienda/Main_layout_tienda";

const PacksPage = () => {
    const navigate = useNavigate();
    const [packs, setPacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('newest');
    const [totalPacks, setTotalPacks] = useState(0);

    useEffect(() => {
        loadPacks();
    }, [sortBy]);

    const loadPacks = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await packsApi.getAllPacks({ sort_by: sortBy });
            setPacks(data.packs);
            setTotalPacks(data.total);
        } catch (err) {
            setError('No se pudieron cargar los packs');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    if (loading) {
        return (
            <div className={styles.packsPage}>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Cargando packs...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.packsPage}>
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
            <div className={styles.packsPage}>
                <div className={styles.pageContainer}>

                    <div className={styles.toolbar}>
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

                    {/* Grid de packs */}
                    <PackGrid 
                        packs={packs} 
                        emptyMessage="No hay packs disponibles"
                    />
                </div>
            </div>
        </MainLayout>
    );
};

export default PacksPage;