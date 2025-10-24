import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const api = {
    register: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/users/register`, userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Registration failed' };
        }
    },

    login: async (credentials) => {
        try {
            const response = await axios.post(`${API_URL}/users/login`, credentials);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Login failed' };
        }
    },
    
    getCart: async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/carts/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to get cart' };
        }
    },

    updateCart: async (userId, items) => {
        try {
            const response = await axios.put(`${API_URL}/carts/${userId}`, { items });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to update cart' };
        }
    },

    addToCart: async (userId, item) => {
        try {
            const response = await axios.post(`${API_URL}/carts/${userId}/items`, item);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to add item to cart' };
        }
    },

    clearCart: async (userId) => {
        try {
            const response = await axios.delete(`${API_URL}/carts/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to clear cart' };
        }
    },

    getInventory: async () => {
        try {
            const response = await axios.get(`${API_URL}/inventory`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch inventory' };
        }
    }
};