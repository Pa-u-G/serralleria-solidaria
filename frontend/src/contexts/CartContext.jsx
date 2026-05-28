import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const API = 'http://localhost:8000/api';
const headers = () => ({
    Authorization: `Bearer ${localStorage.getItem('api_token')}`
});

export function CartProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const [cart, setCart] = useState(null);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const res = await axios.get(`${API}/cart`, { headers: headers() });
            setCart(res.data.cart);
            setSettings(res.data.settings);
        } catch (err) {
            console.error('Error cargando carrito', err);
        }
    }, [isAuthenticated]);

    const addToCart = useCallback(async (type, id, quantity = 1) => {
        if (!isAuthenticated) return false;
        setLoading(true);
        try {
            const res = await axios.post(
                `${API}/cart/add`,
                { type, id, quantity },
                { headers: headers() }
            );
            setCart(res.data.cart);
            return true;
        } catch (err) {
            console.error('Error añadiendo al carrito', err);
            return false;
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const updateQuantity = useCallback(async (detailId, quantity) => {
        await axios.patch(`${API}/cart/detail/${detailId}`, { quantity }, { headers: headers() });
        await fetchCart();
    }, [fetchCart]);

    const updateExtraKey = useCallback(async (detailId, extra_key) => {
        await axios.patch(`${API}/cart/detail/${detailId}/extrakey`, { extra_key }, { headers: headers() });
        await fetchCart();
    }, [fetchCart]);

    const updateInstall = useCallback(async (install) => {
        await axios.patch(`${API}/cart/install`, { install }, { headers: headers() });
        await fetchCart();
    }, [fetchCart]);

    const removeDetail = useCallback(async (detailId) => {
        await axios.delete(`${API}/cart/detail/${detailId}`, { headers: headers() });
        await fetchCart();
    }, [fetchCart]);

    const cartCount = cart?.details?.reduce((acc, d) => acc + d.quantity, 0) ?? 0;

    return (
        <CartContext.Provider value={{
            cart, settings, cartCount, loading,
            fetchCart, addToCart,
            updateQuantity, updateExtraKey, updateInstall, removeDetail
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}