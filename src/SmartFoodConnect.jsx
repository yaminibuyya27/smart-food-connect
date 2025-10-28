import { useState, useEffect } from 'react';
import { api } from './services/api';
import InventoryView from './views/InventoryView.jsx';
import Header from './components/Header.jsx';
import LoginView from './views/LoginView.jsx';
import RegisterView from './views/RegisterView.jsx';
import UserBrowseView from './views/UserBrowserView.jsx';
import CheckoutView from './views/CheckoutView.jsx';
import HomeView from './views/HomeView.jsx';
import CartView from './views/CartView.jsx';
import CharityBrowseView from './views/CharityBrowserView.jsx';


const SmartFoodConnect = () => {
    const [activeView, setActiveView] = useState("home");
    const [currentUser, setCurrentUser] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [inventoryItems, setInventoryItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const addNotification = (itemId) => {
        setNotifications(prev => [...prev, itemId]);
    };

    const removeFromCart = async (itemId) => {
        try {
            setLoading(true);
            setCartItems(prev => prev.filter(item => item.id !== itemId));
        } catch (error) {
            console.error('Failed to remove from cart:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadCart = async () => {
            if (currentUser?._id) {
                try {
                    const response = await api.getCart(currentUser._id);
                    setCartItems(response.items || []);
                } catch (error) {
                    console.error('Failed to load cart:', error);
                }
            }
        };
        loadCart();
    }, [currentUser]);

    useEffect(() => {
        fetchInventoryItems();
    }, []);
    
    const fetchInventoryItems = async () => {
        try {
            const response = await api.getInventory();
            setInventoryItems(response.data);
        } catch (error) {
            console.error('Failed to fetch inventory items:', error);
        }
    };

    const addToCart = async (item) => {
        if (!currentUser) {
            alert("Please login to add items to cart");
            setActiveView("login");
            return;
        }
       
        setCartItems([...cartItems, item]);

        try {
            setLoading(true);
            const response = await api.addToCart(currentUser._id, item);
            setCartItems(response.items);
        } catch (error) {
            console.error('Failed to add to cart:', error);
        } finally {
            setLoading(false);
        }
    };
      
    const clearCart = async () => {
        if (!currentUser) return;

        try {
            setLoading(true);
            await api.clearCart(currentUser._id);
            setCartItems([]);
        } catch (error) {
            console.error('Failed to clear cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            if (currentUser?._id) {
                await api.updateCart(currentUser._id, cartItems);
            }
        } catch (error) {
            console.error('Failed to save cart:', error);
        } finally {
            setCurrentUser(null);
            setCartItems([]);
            setActiveView("home");
        }
    };

    const renderView = () => {
        switch (activeView) {
            case "login":
                return <LoginView setCurrentUser={setCurrentUser} setActiveView={setActiveView} setCartItems={setCartItems} />;
            case "register":
                return <RegisterView setActiveView={setActiveView} />;
            case "charityBrowse":
                return <CharityBrowseView addToCart={addToCart} addNotification={addNotification} notifications={notifications} />;
            case "userBrowse":
                return <UserBrowseView inventoryItems={inventoryItems} addToCart={addToCart} addNotification={addNotification} notifications={notifications} />;
            case "cart":
                return <CartView items={cartItems} setActiveView={setActiveView} removeFromCart={removeFromCart} clearCart={clearCart} loading={loading} />;
            case "inventory": 
                return <InventoryView />;
            case "checkout":
                return <CheckoutView setActiveView={setActiveView} />;
            default:
                return <HomeView setActiveView={setActiveView} />;
        }
    };
 
    return (
        <div className="flex flex-col min-h-screen">
            <Header 
                setActiveView={setActiveView} 
                cartItemsCount={cartItems.length} 
                currentUser={currentUser}
                handleLogout={handleLogout}
            />
            <main className="flex-grow container mx-auto px-4 py-8">
                {renderView()}
            </main>

            {/* Add Footer here */}
        </div>
    );
};



export default SmartFoodConnect;