import axios from 'axios';

const API_URL = 'http://localhost:8080/api/games';

export const gameService = {
    // Submit game results
    submitGameResult: async (gameData) => {
        try {
            const token = localStorage.getItem('token');
            console.log('=== Game Result Submission ===');
            console.log('Token Status:', token ? 'Present' : 'Missing');
            console.log('Game Data:', gameData);
            
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.post(`${API_URL}/results`, gameData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('Response from server:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw error;
        }
    },

    // Get user's game results
    getUserGameResults: async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('=== Fetching User Game Results ===');
            console.log('Token Status:', token ? 'Present' : 'Missing');
            
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.get(`${API_URL}/results/user`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('User Results:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw error;
        }
    },

    // Get user's game results by type
    getUserGameResultsByType: async (gameType) => {
        try {
            const token = localStorage.getItem('token');
            console.log('=== Fetching Game Results by Type ===');
            console.log('Token Status:', token ? 'Present' : 'Missing');
            console.log('Game Type:', gameType);
            
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.get(`${API_URL}/results/user/${gameType}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('Results by Type:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw error;
        }
    },

    // Get user's game results by category
    getUserGameResultsByCategory: async (category) => {
        try {
            const token = localStorage.getItem('token');
            console.log('=== Fetching Game Results by Category ===');
            console.log('Token Status:', token ? 'Present' : 'Missing');
            console.log('Category:', category);
            
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.get(`${API_URL}/results/user/category/${category}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('Results by Category:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw error;
        }
    }
}; 