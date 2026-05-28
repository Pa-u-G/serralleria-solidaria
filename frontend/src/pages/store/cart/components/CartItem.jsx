import React from 'react';
import styles from './CartItem.module.scss';
import { useNavigate } from 'react-router-dom';

const BASE = 'http://localhost:8000/storage/';

const CartItem = ({ detail, onQuantityChange, onExtraKeyChange, onRemove, formatPrice }) => {
    const item = detail.product;
    const isPack = !!item.products; // los packs tienen .products

    const image = item.images?.[0]?.path
        ?? (isPack ? item.products?.find(p => p.images?.[0])?.images[0].path : null);

    const baseTotal = parseFloat(item.price) * detail.quantity;
    const keyTotal  = item.extra_key && detail.extra_key
        ? parseFloat(item.key_price) * detail.extra_key
        : 0;

    const handleClick = () => {
        if (isPack){
            navigate(`/pack/${item.id}`);
        } else {
            navigate(`/product/${item.id}`);
        }
    };
    const navigate = useNavigate();


    return (
        <div className={styles.cartItem}>
            <div className={styles.itemImage} onClick={handleClick}>
                {image
                    ? <img src={`${BASE}${image}`} alt={item.name} />
                    : <div className={styles.noImage}>
                        <svg>
                            <use href="#icon-box?"></use>
                        </svg>
                    </div>
                }
            </div>

            <div className={styles.itemInfo}>
                <div className={styles.itemHeader}>
                    <h3 onClick={handleClick}>{item.name}</h3>
                    {isPack && <span className={styles.packBadge}>Pack</span>}
                    <button className={styles.removeBtn} onClick={onRemove}>✕</button>
                </div>

                <div className={styles.itemPrice}>{formatPrice(item.price)} / ud.</div>

                {/* Cantidad */}
                <div className={styles.quantityRow}>
                    <label>Cantidad:</label>
                    <div className={styles.quantityControls}>
                        <button
                            onClick={() => onQuantityChange(detail.quantity - 1)}
                            disabled={detail.quantity <= 1}
                        >−</button>
                        <span>{detail.quantity}</span>
                        <button onClick={() => onQuantityChange(detail.quantity + 1)}>+</button>
                    </div>
                    <span className={styles.lineTotal}>{formatPrice(baseTotal)}</span>
                </div>

                {/* Llaves extra */}
                { item.extra_key ? 
                    item.extra_key && (
                        <div className={styles.extraKeyRow}>
                            <label>Llaves extra <span className={styles.keyPrice}>({formatPrice(item.key_price)} / llave)</span>:</label>
                            <input
                                type="number"
                                min="0"
                                value={detail.extra_key}
                                onChange={(e) => onExtraKeyChange(parseInt(e.target.value) || 0)}
                                className={styles.keyInput}
                            />
                            {keyTotal > 0 && (
                                <span className={styles.lineTotal}>{formatPrice(keyTotal)}</span>
                            )}
                        </div>
                    ) : ""
                }
            </div>
        </div>
    );
};

export default CartItem;