import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);

    const getToken = () => localStorage.getItem('api_token');

    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const res = await axios.get('http://localhost:8000/api/cart', {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setCart(res.data.cart);
        } catch (err) {
            console.error('Error cargando carrito', err);
        }
    }, [isAuthenticated]);

    /**
     * type: 'product' | 'pack'
     * id: number
     * quantity: number
     * Devuelve true si OK, false si no autenticado (para abrir login)
     */
    const addToCart = useCallback(async (type, id, quantity = 1) => {
        if (!isAuthenticated) return false;

        setLoading(true);
        try {
            const res = await axios.post(
                'http://localhost:8000/api/cart/add',
                { type, id, quantity },
                { headers: { Authorization: `Bearer ${getToken()}` } }
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

    const updateDetail = useCallback(async (detailId, quantity) => {
        try {
            await axios.patch(
                `http://localhost:8000/api/cart/detail/${detailId}`,
                { quantity },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            await fetchCart();
        } catch (err) {
            console.error('Error actualizando detalle', err);
        }
    }, [fetchCart]);

    const removeDetail = useCallback(async (detailId) => {
        try {
            await axios.delete(
                `http://localhost:8000/api/cart/detail/${detailId}`,
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            await fetchCart();
        } catch (err) {
            console.error('Error eliminando detalle', err);
        }
    }, [fetchCart]);

    const cartCount = cart?.details?.reduce((acc, d) => acc + d.quantity, 0) ?? 0;

    return (
        <CartContext.Provider value={{
            cart, cartCount, loading,
            fetchCart, addToCart, updateDetail, removeDetail
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}