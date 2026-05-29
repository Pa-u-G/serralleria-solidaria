import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export function useAddToCart() {
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();

    const handleAddToCart = async (type, id, quantity = 1) => {
        if (!isAuthenticated) {
            window.open('/login', '_blank');
            return;
        }
        await addToCart(type, id, quantity);
    };

    return { handleAddToCart };
}