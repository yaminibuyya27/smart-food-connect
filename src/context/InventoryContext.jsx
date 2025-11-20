import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const InventoryContext = createContext({
  inventoryItems: [],
  loading: true,
  error: null,
  lastFetch: null,
  refetchInventory: () => {},
  // eslint-disable-next-line no-unused-vars
  updateInventoryItem: (_itemId, _updates) => {},
  // eslint-disable-next-line no-unused-vars
  addInventoryItem: (_newItem) => {},
  // eslint-disable-next-line no-unused-vars
  removeInventoryItem: (_itemId) => {},
});

export const InventoryProvider = ({ children }) => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  const fetchInventory = useCallback(async (force = false) => {
    if (inventoryItems.length > 0 && !force) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await api.getInventory();
      setInventoryItems(data);
      setLastFetch(new Date());
    } catch (err) {
      setError(err.message);
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  }, [inventoryItems.length]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const refetchInventory = useCallback(() => {
    return fetchInventory(true);
  }, [fetchInventory]);

  const updateInventoryItem = useCallback((itemId, updates) => {
    setInventoryItems(prevItems =>
      prevItems.map(item =>
        item._id === itemId ? { ...item, ...updates } : item
      )
    );
  }, []);

  const addInventoryItem = useCallback((newItem) => {
    setInventoryItems(prevItems => [...prevItems, newItem]);
  }, []);

  const removeInventoryItem = useCallback((itemId) => {
    setInventoryItems(prevItems =>
      prevItems.filter(item => item._id !== itemId)
    );
  }, []);

  const value = {
    inventoryItems,
    loading,
    error,
    lastFetch,
    refetchInventory,
    updateInventoryItem,
    addInventoryItem,
    removeInventoryItem,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useInventory = () => {
  const context = useContext(InventoryContext);
  
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  
  return context;
};