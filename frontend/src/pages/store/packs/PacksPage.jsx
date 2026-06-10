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
            setError('No s\'han pogut carregar els packs');
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
                    <p>Carregant packs...</p>
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
                        Tornar enrere
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

                    {/* Graella de packs */}
                    <PackGrid 
                        packs={packs} 
                        emptyMessage="No hi ha packs disponibles"
                    />
                </div>
            </div>
        </MainLayout>
    );
};

export default PacksPage;