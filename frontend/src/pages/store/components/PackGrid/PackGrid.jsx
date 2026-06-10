import React from 'react';
import PackCard from '../PackCard/PackCard';
import styles from './PackGrid.module.scss';

const PackGrid = ({ packs, emptyMessage = "No hi ha packs disponibles" }) => {
    if (packs.length === 0) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                    <svg>
                        <use href="#icon-box?"></use>
                    </svg>
                </div>
                <h3>{emptyMessage}</h3>
                <p>Aviat tindrem nous packs disponibles</p>
            </div>
        );
    } else {
        return (
            <div className={styles.packGrid}>
                {packs.map(pack => (
                    <PackCard key={pack.id} pack={pack} />
                ))}
            </div>
        );
    }

};

export default PackGrid;