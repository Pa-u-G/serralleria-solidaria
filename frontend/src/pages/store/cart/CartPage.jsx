import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import { useAuth } from '../../../contexts/AuthContext';
import MainLayout from '../../../layouts/layoutTienda/Main_layout_tienda';
import CheckoutModal from './components/CheckoutModal';
import CartItem from './components/CartItem';
import styles from './CartPage.module.scss';

const CartPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const {
        cart, settings, fetchCart,
        updateQuantity, updateExtraKey, updateInstall, removeDetail
    } = useCart();

    const [showCheckout, setShowCheckout] = useState(false);
    const [install, setInstall]           = useState(false);
    const [stockErrors, setStockErrors] = useState([]);

    useEffect(() => {
        if (!isAuthenticated) { navigate('/login'); return; }
        fetchCart();
    }, [isAuthenticated]);

    useEffect(() => {
        if (cart) setInstall(cart.install);
    }, [cart]);

    // ---------- cálculos ----------
    const formatPrice = (n) =>
        new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n);

    const getItemBasePrice = (detail) => {
        const p = detail.product;
        return parseFloat(p.price) * detail.quantity;
    };

    const getItemKeyPrice = (detail) => {
        const p = detail.product;
        if (!p.extra_key || !detail.extra_key) return 0;
        return parseFloat(p.key_price) * detail.extra_key;
    };

    const subtotal = cart?.details?.reduce((acc, d) =>
        acc + getItemBasePrice(d) + getItemKeyPrice(d), 0) ?? 0;

    const shippingPrice = settings?.shipping_price ?? 9;

    // Precio de instalación según tramos
    const installableTotal = cart?.details?.reduce((acc, d) => {
        const p = d.product;
        if (p.installable) return acc + parseFloat(p.price) * d.quantity;
        // Si es pack, sus productos installables
        if (p.products) {
            return acc + p.products
                .filter(pp => pp.installable)
                .reduce((a, pp) => a + parseFloat(pp.price) * pp.pivot.amount * d.quantity, 0);
        }
        return acc;
    }, 0) ?? 0;

    const getInstallPrice = () => {
        if (!settings) return 0;
        if (installableTotal === 0) return 0;
        if (installableTotal <= 250)  return settings.install_price_tier1;
        if (installableTotal <= 500)  return settings.install_price_tier2;
        if (installableTotal <= 1000) return settings.install_price_tier3;
        if (installableTotal > 1000) return settings.install_price_tier4;
        return -1; // a consultar
    };

    const installPrice    = getInstallPrice();
    const hasInstallable  = installableTotal > 0;
    const installConsultar = installPrice <= -1;

    const total = subtotal + shippingPrice + (install && !installConsultar ? installPrice : 0);

    // ---------- handlers ----------
    const handleInstallToggle = async (val) => {
        setInstall(val);
        await updateInstall(val);
    };

    const checkStock = () => {
        const stockNeeded = {};

        cart.details.forEach(detail => {
            const p = detail.product;

            if (!p.products) {
                // Producto normal
                stockNeeded[p.id] = (stockNeeded[p.id] ?? 0) + detail.quantity;
            } else {
                // Pack: acumular por cada producto del pack
                p.products.forEach(pp => {
                    const needed = pp.pivot.amount * detail.quantity;
                    stockNeeded[pp.id] = (stockNeeded[pp.id] ?? 0) + needed;
                });
            }
        });

        // Buscar el producto en el carrito para obtener nombre y stock
        const productMap = {};
        cart.details.forEach(detail => {
            const p = detail.product;
            if (!p.products) {
                productMap[p.id] = p;
            } else {
                p.products.forEach(pp => { productMap[pp.id] = pp; });
            }
        });

        const errors = [];
        Object.entries(stockNeeded).forEach(([id, needed]) => {
            const p = productMap[id];
            if (p && p.stock < needed) {
                errors.push({
                    name:      p.name,
                    available: p.stock,
                    requested: needed,
                });
            }
        });

        return errors;
    };

    const handleCheckout = () => {
        const errors = checkStock();
        setStockErrors(errors);
        if (errors.length === 0) setShowCheckout(true);
    };



    if (!cart || cart.details?.length === 0) {
        return (
            <MainLayout>
                <div className={styles.cartPage}>
                    <div className={styles.emptyCart}>
                        <div className={styles.emptyIcon}>🛒</div>
                        <h2>Tu carrito está vacío</h2>
                        <p>Añade productos para continuar</p>
                        <button onClick={() => navigate('/products')} className={styles.shopBtn}>
                            Ver productos
                        </button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className={styles.cartPage}>
                <h1 className={styles.title}>Tu carrito</h1>

                <div className={styles.cartLayout}>
                    {/* Lista de items */}
                    <div className={styles.itemsList}>
                        {cart.details.map(detail => (
                            <CartItem
                                key={detail.id}
                                detail={detail}
                                onQuantityChange={(q) => updateQuantity(detail.id, q)}
                                onExtraKeyChange={(k) => updateExtraKey(detail.id, k)}
                                onRemove={() => removeDetail(detail.id)}
                                formatPrice={formatPrice}
                            />
                        ))}
                    </div>

                    {/* Resumen */}
                    <div className={styles.summary}>
                        <h2>Resumen del pedido</h2>

                        <div className={styles.summaryRow}>
                            <span>Subtotal</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>

                        <div className={styles.summaryRow}>
                            <span>Envío</span>
                            <span>{formatPrice(shippingPrice)}</span>
                        </div>

                        {/* Opción instalación */}
                        {hasInstallable && (
                            <div className={styles.installOption}>
                                <label className={styles.installLabel}>
                                    <input
                                        type="checkbox"
                                        checked={install}
                                        onChange={(e) => handleInstallToggle(e.target.checked)}
                                    />
                                    <span>Instalación</span>
                                </label>
                                {install? install && (
                                    <span className={styles.installPrice}>
                                        {installConsultar
                                            ? 'A consultar'
                                            : formatPrice(installPrice)}
                                    </span>
                                ) : ""}
                            </div>
                        )}

                        <div className={styles.divider} />

                        <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                            <span>Total:</span>
                            <span>
                                {installConsultar && install
                                    ? `${formatPrice(subtotal + shippingPrice)} + instalación a consultar`
                                    : formatPrice(total)}
                            </span>
                        </div>

                        <button
                            className={styles.checkoutBtn}
                            onClick={handleCheckout}
                        >
                            Tramitar pedido
                        </button>
                        {stockErrors.length > 0 && (
                            <div className={styles.stockErrors}>
                                <p>Stock insuficiente:</p>
                                <ul>
                                    {stockErrors.map((e, i) => (
                                        <li key={i}>
                                            <strong>{e.name}</strong>: pedido {e.requested}, disponible {e.available}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showCheckout && (
                <CheckoutModal
                    onClose={() => setShowCheckout(false)}
                    total={total}
                    installConsultar={installConsultar && install}
                    formatPrice={formatPrice}
                />
            )}
        </MainLayout>
    );
};

export default CartPage;