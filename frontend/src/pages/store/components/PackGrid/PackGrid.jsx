import React from 'react';
import PackCard from '../PackCard/PackCard';
import styles from './PackGrid.module.scss';

const PackGrid = ({ packs, emptyMessage = "No hay packs disponibles" }) => {
    if (packs.length === 0) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📦</div>
                <h3>{emptyMessage}</h3>
                <p>Pronto tendremos nuevos packs disponibles</p>
            </div>
        );
    }

    return (
        <div className={styles.packGrid}>
            {packs.map(pack => (
                <PackCard key={pack.id} pack={pack} />
            ))}
        </div>
    );
};

export default PackGrid;