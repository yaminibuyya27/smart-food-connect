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
import RetailerBrowserView from './views/RetailerBrowserView.jsx';
import { InventoryProvider } from './context/InventoryContext.jsx';


const SmartFoodConnect = () => {
    const [activeView, setActiveView] = useState("home");
    const [currentUser, setCurrentUser] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedUser = localStorage.getItem('currentUser');
        const savedView = localStorage.getItem('activeView');
        
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                setCurrentUser(user);
                loadUserCart(user._id);
                
                if (savedView) {
                    setActiveView(savedView);
                }
            } catch (error) {
                console.error('Failed to parse saved user:', error);
                localStorage.removeItem('currentUser');
                localStorage.removeItem('activeView');
            }
        }
    }, []);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('currentUser');
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('activeView', activeView);
        }
    }, [activeView, currentUser]);

    const loadUserCart = async (userId) => {
        try {
            const response = await api.getCart(userId);
            if (response && response.items) {
                setCartItems(response.items);
            }
        } catch (error) {
            console.error('Failed to load cart:', error);
        }
    };

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

    const addToCart = async (item) => {
        if (!currentUser) {
            alert("Please login to add items to cart");
            setActiveView("login");
            return;
        }

        const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);

        let updatedCart;
        if (existingItemIndex !== -1) {
            updatedCart = [...cartItems];
            const currentCartQuantity = updatedCart[existingItemIndex].cartQuantity || 1;

            if (currentCartQuantity >= item.quantity) {
                return;
            }

            updatedCart[existingItemIndex] = {
                ...updatedCart[existingItemIndex],
                cartQuantity: currentCartQuantity + 1
            };
        } else {
            updatedCart = [...cartItems, { ...item, cartQuantity: 1 }];
        }

        setCartItems(updatedCart);

        try {
            setLoading(true);
            const response = await api.addToCart(currentUser._id, item);
            if (response && response.items) {
                setCartItems(response.items);
            }
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

    const updateCartQuantity = (itemId, change) => {
        const itemIndex = cartItems.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;

        const item = cartItems[itemIndex];
        const currentCartQuantity = item.cartQuantity || 1;
        const newQuantity = currentCartQuantity + change;

        if (newQuantity < 1) return;

        const updatedCart = [...cartItems];
        updatedCart[itemIndex] = {
            ...updatedCart[itemIndex],
            cartQuantity: newQuantity
        };
        setCartItems(updatedCart);
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
            localStorage.removeItem('currentUser');
            localStorage.removeItem('activeView');
        }
    };

    const renderView = () => {
        switch (activeView) {
            case "login":
                return <LoginView setCurrentUser={setCurrentUser} setActiveView={setActiveView} setCartItems={setCartItems} />;
            case "register":
                return <RegisterView setActiveView={setActiveView} />;
            case "charityBrowse":
                return <CharityBrowseView currentUser={currentUser} addToCart={addToCart} setActiveView={setActiveView} notifications={notifications} cartItems={cartItems} updateCartQuantity={updateCartQuantity} removeFromCart={removeFromCart} />;
            case "userBrowse":
                return <UserBrowseView currentUser={currentUser} setActiveView={setActiveView} addToCart={addToCart} notifications={notifications} cartItems={cartItems} updateCartQuantity={updateCartQuantity} removeFromCart={removeFromCart} />;
            case "retailerBrowse":
                return <RetailerBrowserView currentUser={currentUser} setActiveView={setActiveView} addToCart={addToCart} addNotification={addNotification} notifications={notifications} cartItems={cartItems} updateCartQuantity={updateCartQuantity} removeFromCart={removeFromCart} />;
            case "cart":
                return <CartView items={cartItems} setActiveView={setActiveView} removeFromCart={removeFromCart} clearCart={clearCart} updateCartQuantity={updateCartQuantity} loading={loading} />;
            case "inventory": 
                return <InventoryView />;
            case "checkout":
                return <CheckoutView setActiveView={setActiveView} cartItems={cartItems} clearCart={clearCart} />;
            default:
                return <HomeView setActiveView={setActiveView} />;
        }
    };

    const getTotalCartQuantity = () => {
        return cartItems.reduce((total, item) => total + (item.cartQuantity || 1), 0);
    };
 
    return (
        <InventoryProvider>
            <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
                <Header
                    setActiveView={setActiveView}
                    cartItemsCount={getTotalCartQuantity()}
                    currentUser={currentUser}
                    handleLogout={handleLogout}
                />
                <main className="flex-grow container mx-auto px-4 py-8">
                    {renderView()}
                </main>

                {/* Add Footer here */}
            </div>
        </InventoryProvider>
    );
};



export default SmartFoodConnect;