const API_URL = 'http://localhost:8000/api/store';

export const categoryApi = {
    async getProductsByCategory(categoryId, filters = {}) {
        // Construir query string
        const params = new URLSearchParams();
        
        if (filters.characteristics && filters.characteristics.length > 0) {
            filters.characteristics.forEach(charId => {
                params.append('characteristics[]', charId);
            });
        }
        
        if (filters.star) {
            params.append('star', filters.star);
        }
        
        if (filters.sort_by) {
            params.append('sort_by', filters.sort_by);
        }
        
        const url = `${API_URL}/category/${categoryId}/products${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Error al cargar productos');
        return response.json();
    },
    
    async getCategoryInfo(categoryId) {
        const response = await fetch(`${API_URL}/category/${categoryId}/info`);
        if (!response.ok) throw new Error('Error al cargar información de la categoría');
        return response.json();
    }
};