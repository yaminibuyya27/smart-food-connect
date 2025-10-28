import { useEffect, useState } from "react";
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../components/UIComponents';
import { ShoppingBag, Bell } from 'lucide-react';
import { api } from "../services/api";
import { handleNotification } from "../components/notifications";

const CharityBrowseView = ({ CurrentUser, setActiveView, addToCart, addNotification, notifications }) => {
    const [foodItems, setFoodItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const API_URL = import.meta.env.VITE_API_URL || '';
  
    useEffect(() => {
      fetchFoodItems();
    }, []);
  
    const fetchFoodItems = async () => {
      try {
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
      .filter(item => item.type === 'charity');
  
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Available Donations</CardTitle>
          <CardDescription>Claim donations for your charity</CardDescription>
        </CardHeader>
  
        <CardContent>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Search donations..."
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
  
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFoodItems.map((item) => (
                <Card key={item.id} className="flex flex-col">
                  <CardHeader>
                    <div className="w-full h-64 overflow-hidden bg-gray-50 rounded-t">
                      <img
                        src={`${API_URL}/api/inventory/image/${item.id}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder-food.png';
                          e.target.onerror = null;
                        }}
                      />
                    </div>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <p className="font-bold text-lg mb-1">${item.price}</p>
                    <p className="text-sm mb-1">Best before: {new Date(item.expiry).toLocaleDateString()}</p>
                    <p className="text-sm mb-1">Status: {item.available ? "Available" : "Out of Stock"}</p>
                    <p className="text-sm">Quantity: {item.quantity}</p>
                  </CardContent>
                  <CardFooter>
                    {item.available ? (
                      <Button onClick={() => addToCart(item)} 
                      className="w-full inline-flex flex-row items-center justify-center gap-2">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => {
                          if(CurrentUser === null) {
                            alert("Please login before adding items to the cart");
                            setActiveView('login');
                          }
                          handleNotification(CurrentUser, item)}
                        }
                        disabled={notifications.includes(item.id)}
                        className="w-full inline-flex flex-row items-center justify-center gap-2"
                      >
                        <Bell className="mr-2 h-4 w-4" />
                        {notifications.includes(item.id) ? "Notified" : "Notify When Available"}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
};

export default CharityBrowseView;