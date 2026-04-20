const API_URL = 'http://localhost:8000/api';

export const allProductsApi = {
    async getAllProducts() {
        const response = await fetch(`${API_URL}/store/products`);
        if (!response.ok) throw new Error('Error al cargar los productos');
        return response.json();
    }
};