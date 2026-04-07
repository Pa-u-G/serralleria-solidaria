const API_URL = 'http://localhost:8000/api/store';

export const categoryApi = {
    async getProductsByCategory(categoryId) {
        const response = await fetch(`${API_URL}/category/${categoryId}/products`);
        if (!response.ok) throw new Error('Error al cargar productos');
        return response.json();
    },
    
    async getCategoryInfo(categoryId) {
        const response = await fetch(`${API_URL}/category/${categoryId}/info`);
        if (!response.ok) throw new Error('Error al cargar información de la categoría');
        return response.json();
    }
};