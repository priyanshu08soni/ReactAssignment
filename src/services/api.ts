import type { ApiResponse } from '../types';

const BASE_URL = 'https://api.artic.edu/api/v1/artworks';

export const fetchArtworks = async (page: number, limit: number = 12): Promise<ApiResponse> => {
    try {
        const fields = 'id,title,place_of_origin,artist_display,inscriptions,date_start,date_end';
        const response = await fetch(`${BASE_URL}?page=${page}&limit=${limit}&fields=${fields}`);

        if (!response.ok) {
            throw new Error(`Error fetching artworks: ${response.statusText}`);
        }

        const data: ApiResponse = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};
