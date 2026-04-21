const API_URL = 'http://localhost:8000/api/store';

export const allProductsApi = {
    async getAllProducts(filters = {}) {
        // Construir query string
        const params = new URLSearchParams();
        
        if (filters.characteristics && filters.characteristics.length > 0) {
            filters.characteristics.forEach(charId => {
                params.append('characteristics[]', charId);
            });
        }
        
        if (filters.category_id) {
            params.append('category_id', filters.category_id);
        }
        
        if (filters.star) {
            params.append('star', filters.star);
        }
        
        if (filters.sort_by) {
            params.append('sort_by', filters.sort_by);
        }
        
        const url = `${API_URL}/products${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Error al cargar los productos');
        return response.json();
    },
    
    async getFilters() {
        const response = await fetch(`${API_URL}/filters`);
        if (!response.ok) throw new Error('Error al cargar los filtros');
        return response.json();
    }
};