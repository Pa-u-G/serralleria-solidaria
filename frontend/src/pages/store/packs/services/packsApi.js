const API_URL = 'http://localhost:8000/api/store';

export const packsApi = {
    async getAllPacks(filters = {}) {
        const params = new URLSearchParams();
        
        if (filters.sort_by) {
            params.append('sort_by', filters.sort_by);
        }
        
        const url = `${API_URL}/packs${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Error al cargar los packs');
        return response.json();
    }
};