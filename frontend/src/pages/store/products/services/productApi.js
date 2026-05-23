const API_URL = 'http://localhost:8000/api/store';

export const productApi = {
    async getProduct(id) {
        const response = await fetch(`${API_URL}/product/${id}`);
        if (!response.ok) throw new Error('Error al cargar el producto');
        return response.json();
    }
};