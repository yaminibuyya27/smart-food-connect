import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/UIComponents';
import InventoryCard from '../components/InventoryCard';
import { api } from "../services/api";
import { Pencil, Loader2 } from 'lucide-react';
import InventoryView from './InventoryView';

const RetailerBrowserView = ({ currentUser, setActiveView, addNotification, notifications }) => {
  const [foodItems, setFoodItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [itemToEdit, setItemToEdit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const API_URL = import.meta.env.VITE_API_URL || '';

  const fetchFoodItems = async () => {
    try {
      setIsLoading(true);
      const data = await api.getInventory();
      const items = data.map(item => ({
        id: item._id,
        name: item.product,
        price: item.price,
        expiry: item.expiryDate,
        available: item.available,
        category: item.variant,
        description: item.additionalDetails,
        quantity: item.quantity,
        type: item.type
      }));
      setFoodItems(items);
      const uniqueCategories = [...new Set(items.map(item => item.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching food items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFoodItems = foodItems
    .filter(item => {
      const expiryDate = new Date(item.expiry);
      const today = new Date();
      const diffTime = expiryDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 3;
    })
    .filter(item => !selectedCategory || item.category === selectedCategory)
    .filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const editItem = (item) => {
    if (currentUser == null) {
      alert("Please login before editing the item");
      setActiveView("login");
      return;
    }
    
    setItemToEdit(item);
  };

  const handleEditClose = () => {
    setItemToEdit(null);
  };

  const handleEditSuccess = async () => {
    await fetchFoodItems();
    addNotification?.({ type: 'success', message: 'Item updated successfully!' });
  };

  const renderEditAction = (item) => (
    <Button 
      onClick={() => editItem(item)} 
      className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
      size="lg"
    >
      <Pencil className="h-4 w-4" />
      Edit
    </Button>
  );

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Your Inventory</CardTitle>
          <CardDescription>Manage your food items</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border rounded bg-white"
              />
            </div>

            <div>
              <label htmlFor="category" className="block mb-2 font-bold">
                Filter by Category:
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border rounded bg-white"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
                <p className="text-gray-500 text-lg">Loading inventory...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFoodItems.map((item) => (
                    <InventoryCard
                      key={item.id}
                      item={item}
                      apiUrl={API_URL}
                      currentUser={currentUser}
                      notifications={notifications}
                      renderAction={renderEditAction}
                    />
                  ))}
                </div>

                {filteredFoodItems.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No items in your inventory matching your criteria</p>
                    <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or add new items to your inventory</p>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {itemToEdit && (
        <InventoryView
          mode="edit"
          itemToEdit={itemToEdit}
          onClose={handleEditClose}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
};

export default RetailerBrowserView;