import { Button } from "./UIComponents";
import Logo from "./Logo";
import { LogOut, LogIn, UserPlus, ShoppingCart, Plus, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Header = ({ setActiveView, cartItemsCount, currentUser, handleLogout }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">

                    <Logo 
                        onClick={() => {
                            if (currentUser === null) {
                                setActiveView("home");
                            }
                            else if (currentUser.userType === 'shopper') {
                                setActiveView("userBrowse");
                            }
                            else if (currentUser.userType === 'retailer') {
                                setActiveView("retailerBrowse");
                            }
                            else if (currentUser.userType === 'charity') {
                                setActiveView("charityBrowse");
                            }
                            setMobileMenuOpen(false);
                        }}
                    />

                    <nav className="hidden md:flex items-center space-x-3">
                        {currentUser ? (
                            <>
                                <span className="text-gray-700 font-medium px-3">
                                    Welcome, <span className="text-blue-600">{currentUser.name}</span>
                                </span>
                                
                                {(currentUser.userType === "shopper" || currentUser.userType === "charity") && (
                                    <Button
                                        variant="outline"
                                        onClick={() => setActiveView("cart")}
                                        className="inline-flex items-center gap-2 relative bg-gradient-to-r from-blue-500 to-blue-600 hover:bg-gray-50 hover:from-blue-600 hover:to-blue-700 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                                    >
                                        <ShoppingCart className="h-4 w-4" />
                                        Cart
                                        {cartItemsCount > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                                                {cartItemsCount}
                                            </span>
                                        )}
                                    </Button>
                                )}

                                {currentUser.userType === "retailer" && (
                                    <Button 
                                        onClick={() => setActiveView("inventory")}
                                        variant="outline"
                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-md"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Inventory
                                    </Button>
                                )}

                                <Button 
                                    variant="ghost" 
                                    onClick={handleLogout}
                                    className="inline-flex items-center gap-2 text-gray-700 hover:bg-red-50 hover:text-red-600"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button 
                                    variant="outline" 
                                    onClick={() => setActiveView("login")}
                                    className="inline-flex items-center gap-2 border-2 border-blue-500 text-white bg-blue-500 hover:bg-blue-600 hover:border-blue-600 font-semibold"
                                >
                                    <LogIn className="h-4 w-4" />
                                    Login
                                </Button>
                                <Button 
                                    onClick={() => setActiveView("register")}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-md"
                                    variant="outline"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    Sign Up
                                </Button>
                            </>
                        )}
                    </nav>

                    <button
                        className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6 text-gray-700" />
                        ) : (
                            <Menu className="h-6 w-6 text-gray-700" />
                        )}
                    </button>
                </div>

                {mobileMenuOpen && (
                    <nav className="md:hidden mt-4 pt-4 border-t border-gray-200 space-y-2">
                        {currentUser ? (
                            <>
                                <div className="text-gray-700 font-medium px-3 py-2">
                                    Welcome, <span className="text-blue-600">{currentUser.name}</span>
                                </div>
                                
                                {(currentUser.userType === "shopper" || currentUser.userType === "charity") && (
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setActiveView("cart");
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full inline-flex items-center justify-center gap-2 relative bg-gradient-to-r from-blue-500 to-blue-600 hover:bg-gray-50 hover:from-blue-600 hover:to-blue-700 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                                    >
                                        <ShoppingCart className="h-4 w-4" />
                                        Cart
                                        {cartItemsCount > 0 && (
                                            <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
                                                {cartItemsCount}
                                            </span>
                                        )}
                                    </Button>
                                )}

                                {currentUser.userType === "retailer" && (
                                    <Button 
                                        onClick={() => {
                                            setActiveView("inventory");
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-md"
                                        variant="outline"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Inventory
                                    </Button>
                                )}
                                
                                <Button 
                                    variant="ghost" 
                                    onClick={() => {
                                        handleLogout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full inline-flex items-center justify-center gap-2 text-gray-700 hover:bg-red-50 hover:text-red-600"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button 
                                    variant="outline" 
                                    onClick={() => {
                                        setActiveView("login");
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full inline-flex items-center justify-center gap-2 border-2 border-blue-500 text-white bg-blue-500 hover:bg-blue-600 hover:border-blue-600 font-semibold"
                                >
                                    <LogIn className="h-4 w-4" />
                                    Login
                                </Button>
                                <Button 
                                    onClick={() => {
                                        setActiveView("register");
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-md"
                                    variant="outline"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    Sign Up
                                </Button>
                            </>
                        )}
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;