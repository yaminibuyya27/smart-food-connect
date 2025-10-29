import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/UIComponents';
import InventoryCard from '../components/InventoryCard';
import { Loader2 } from 'lucide-react';
import { api } from "../services/api";
import { handleNotification } from "../components/notifications";

const UserBrowseView = ({ currentUser, setActiveView, addToCart, addNotification, notifications }) => {
  const [foodItems, setFoodItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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
    )
    .filter(item => item.type === 'shopper');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Available Food Items</CardTitle>
        <CardDescription>Browse discounted food near you</CardDescription>
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
              <p className="text-gray-500 text-lg">Loading food items...</p>
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
                    onAddToCart={addToCart}
                    onNotify={handleNotification}
                    onLoginRequired={() => setActiveView('login')}
                  />
                ))}
              </div>

              {filteredFoodItems.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No food items available matching your criteria</p>
                  <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or check back later</p>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserBrowseView;