const API_URL = 'http://localhost:8000/api/store';

export const packApi = {
    async getPack(id) {
        const response = await fetch(`${API_URL}/pack/${id}`);
        if (!response.ok) throw new Error('Error al cargar el pack');
        return response.json();
    }
};