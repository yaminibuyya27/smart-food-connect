import axios from 'axios';

// @ts-ignore - Vite env variable
const API_URL = import.meta.env.VITE_API_URL || '';

export const api = {
    register: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/api/users/register`, userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Registration failed' };
        }
    },

    login: async (credentials) => {
        try {
            const response = await axios.post(`${API_URL}/api/users/login`, credentials);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Login failed' };
        }
    },
    
    getCart: async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/api/carts/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to get cart' };
        }
    },

    updateCart: async (userId, items) => {
        try {
            const response = await axios.put(`${API_URL}/api/carts/${userId}`, { items });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to update cart' };
        }
    },

    addToCart: async (userId, item) => {
        try {
            const response = await axios.post(`${API_URL}/api/carts/${userId}/items`, item);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to add item to cart' };
        }
    },

    clearCart: async (userId) => {
        try {
            const response = await axios.delete(`${API_URL}/api/carts/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to clear cart' };
        }
    },

    getInventory: async () => {
        try {
            const response = await axios.get(`${API_URL}/api/inventory`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch inventory' };
        }
    },

    createInventory: async (inventoryData) => {
        try {
            const response = await axios.post(`${API_URL}/api/inventory`, inventoryData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to create inventory' };
        }
    },

    updateInventoryItem: async (id, formData) => {
        try {
            const response = await axios.put(`${API_URL}/api/inventory/${id}`, formData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to update inventory item' };
        }
    },

    createNotification: async (notificationData) => {
        try {
            const response = await axios.post(`${API_URL}/api/notification`, notificationData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to send notification' };
        }
    },

    getUserNotifications: async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/api/notification/user/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch notifications' };
        }
    },

    createOrder: async (orderData) => {
        try {
            const response = await axios.post(`${API_URL}/api/orders`, orderData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to create order' };
        }
    },

    getUserOrders: async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/api/orders/user/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch orders' };
        }
    },
};