import React, { useState, useEffect } from 'react';
import styles from './FiltersSidebar.module.scss';

const FiltersSidebar = ({ 
    onFilterChange, 
    visible, 
    onClose, 
    selectedFilters: externalFilters,
    showStarFilter = true  // Nova prop per controlar si mostrar el filtre de destacats
}) => {
    const [filters, setFilters] = useState([]);
    const [selectedCharacteristics, setSelectedCharacteristics] = useState([]);
    const [selectedStar, setSelectedStar] = useState(false);
    const [loading, setLoading] = useState(true);
    const [expandedTypes, setExpandedTypes] = useState({});

    useEffect(() => {
        loadFilters();
    }, []);

    useEffect(() => {
        if (externalFilters) {
            setSelectedCharacteristics(externalFilters.characteristics || []);
            setSelectedStar(externalFilters.star || false);
        }
    }, [externalFilters]);

    const loadFilters = async () => {
        try {
            // Importar dinàmicament per evitar dependències circulars
            const { allProductsApi } = await import('../../products/services/allProductsApi');
            const data = await allProductsApi.getFilters();
            setFilters(data);
            // Inicialitzar tots els tipus com a expandits
            const initialExpanded = {};
            data.forEach(type => {
                initialExpanded[type.id] = true;
            });
            setExpandedTypes(initialExpanded);
        } catch (error) {
            console.error('Error loading filters:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleType = (typeId) => {
        setExpandedTypes(prev => ({
            ...prev,
            [typeId]: !prev[typeId]
        }));
    };

    const handleCharacteristicChange = (characteristicId) => {
        setSelectedCharacteristics(prev => {
            const newSelection = prev.includes(characteristicId)
                ? prev.filter(id => id !== characteristicId)
                : [...prev, characteristicId];
            
            // Aplicar filtres després de l'actualització
            setTimeout(() => {
                onFilterChange({
                    characteristics: newSelection,
                    star: selectedStar
                });
            }, 0);
            
            return newSelection;
        });
    };

    const handleStarChange = () => {
        const newStarValue = !selectedStar;
        setSelectedStar(newStarValue);
        
        onFilterChange({
            characteristics: selectedCharacteristics,
            star: newStarValue
        });
    };

    const handleClearFilters = () => {
        setSelectedCharacteristics([]);
        setSelectedStar(false);
        
        onFilterChange({
            characteristics: [],
            star: false
        });
    };

    const getSelectedCount = () => {
        let count = selectedCharacteristics.length;
        if (showStarFilter && selectedStar) count++;
        return count;
    };

    if (loading) {
        return (
            <div className={`${styles.filtersSidebar} ${visible ? styles.visible : ''}`}>
                <div className={styles.sidebarHeader}>
                    <h3>Filtres</h3>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>
                <div className={styles.loadingFilters}>
                    <div className={styles.spinner}></div>
                    <p>Carregant filtres...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Overlay per a mòbil */}
            {visible && <div className={styles.overlay} onClick={onClose}></div>}
            
            <div className={`${styles.filtersSidebar} ${visible ? styles.visible : ''}`}>
                <div className={styles.sidebarHeader}>
                    <h3>Filtres</h3>
                    {getSelectedCount() > 0 && (
                        <span className={styles.selectedCount}>
                            {getSelectedCount()} actius
                        </span>
                    )}
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>

                <div className={styles.filtersContent}>
                    {/* Filtre de productes destacats */}
                    {showStarFilter && (
                        <div className={styles.filterSection}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={selectedStar}
                                    onChange={handleStarChange}
                                />
                                <span>Productes Destacats</span>
                            </label>
                        </div>
                    )}

                    {/* Filtres per característiques */}
                    {filters.map((type) => (
                        <div key={type.id} className={styles.filterSection}>
                            <div 
                                className={styles.filterHeader}
                                onClick={() => toggleType(type.id)}
                            >
                                <h4>{type.type}</h4>
                                <span className={`${styles.expandIcon} ${expandedTypes[type.id] ? styles.expanded : ''}`}>
                                    ▼
                                </span>
                            </div>
                            
                            {expandedTypes[type.id] && (
                                <div className={styles.filterOptions}>
                                    {type.characteristics.map((characteristic) => (
                                        <label key={characteristic.id} className={styles.checkboxLabel}>
                                            <input
                                                type="checkbox"
                                                checked={selectedCharacteristics.includes(characteristic.id)}
                                                onChange={() => handleCharacteristicChange(characteristic.id)}
                                            />
                                            <span>{characteristic.description}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className={styles.sidebarFooter}>
                    <button 
                        className={styles.clearFiltersBtn}
                        onClick={handleClearFilters}
                        disabled={getSelectedCount() === 0}
                    >
                        Netejar filtres
                    </button>
                </div>
            </div>
        </>
    );
};

export default FiltersSidebar;