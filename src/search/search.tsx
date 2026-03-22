import axios from 'axios';

import { useNavigate } from 'react-router-dom';

const API = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 10000,
});


export const SearchComponent = async (value: string, navigate: any) => {
 
   try {
        const response = await API.get('/search', {
            params: { text: value }
        });


        const processed = {
            language: response.data.language,
            success: response.data.success,
            query: response.data.query,
            results: response.data.results,
            duration_ms: response.data.duration_ms,
            length: response.data.length,
            timestamp: new Date().toISOString()
        };
        navigate('/search', { state: { data: processed } });
        
    } catch (error) {
        console.error('Ошибка поиска:', error);
    }



};


export default SearchComponent;