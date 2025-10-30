import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button } from '../components/UIComponents';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag, AlertCircle } from 'lucide-react';

const CartView = ({ items = [], setActiveView, removeFromCart, clearCart, updateCartQuantity, loading }) => {
    const calculateTotal = () => {
        return items.reduce((total, item) => total + (item.price * (item.cartQuantity || 1)), 0).toFixed(2);
    };

    const calculateItemTotal = (item) => {
        return (item.price * (item.cartQuantity || 1)).toFixed(2);
    };

    if (items.length === 0) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg rounded-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <ShoppingCart className="h-8 w-8" />
                            Shopping Cart
                        </h1>
                    </div>

                    <div className="p-12 text-center">
                        <div className="flex justify-center mb-6">
                            <div className="bg-gray-100 rounded-full p-8">
                                <ShoppingBag className="h-24 w-24 text-gray-400" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Looks like you haven't added any items to your cart yet. 
                            Start shopping to reduce food waste and save money!
                        </p>
                        <Button
                            onClick={() => setActiveView("userBrowse")}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                            variant='outline'
                        >
                            <ShoppingBag className="h-5 w-5" />
                            Start Shopping
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg rounded-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                <ShoppingCart className="h-8 w-8" />
                                Shopping Cart
                            </h1>
                            <p className="text-blue-100 mt-2">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
                        </div>
                    </div>

                    {items.map((item) => (
                        <Card 
                            key={item.id} 
                            className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <div className="p-4">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-shrink-0 w-full sm:w-32 h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
                                        <img
                                        // @ts-ignore - Vite env variable
                                            src={`${import.meta.env.VITE_API_URL || ''}/api/inventory/image/${item.id}`}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = '/placeholder-food.png';
                                                e.currentTarget.onerror = null;
                                            }}
                                        />
                                    </div>

                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                                                {item.category && (
                                                    <p className="text-sm text-gray-600">{item.category}</p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                disabled={loading}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                title="Remove item"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>

                                        {item.description && (
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                                        )}

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                                                <div className="flex items-center border-2 border-gray-200 rounded-lg">
                                                    <button
                                                        onClick={() => {
                                                            const currentQty = item.cartQuantity || 1;
                                                            if (currentQty === 1) {
                                                                removeFromCart(item.id);
                                                            } else {
                                                                updateCartQuantity && updateCartQuantity(item.id, -1);
                                                            }
                                                        }}
                                                        disabled={loading}
                                                        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <Minus className="h-4 w-4 text-gray-600" />
                                                    </button>
                                                    <span className="px-4 py-2 font-semibold text-gray-800 min-w-[3rem] text-center">
                                                        {item.cartQuantity || 1}
                                                    </span>
                                                    <button
                                                        onClick={() => updateCartQuantity && updateCartQuantity(item.id, 1)}
                                                        disabled={loading || !updateCartQuantity || (item.cartQuantity || 1) >= item.quantity}
                                                        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <Plus className="h-4 w-4 text-gray-600" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-600">Price:</span>
                                                <span className="text-2xl font-bold text-green-600">
                                                    ${calculateItemTotal(item)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}

                    <div className="flex justify-end">
                        <Button
                            onClick={clearCart}
                            variant="outline"
                            className="inline-flex items-center gap-2 justify-center bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <Trash2 className="h-4 w-4" />
                            Clear Cart
                        </Button>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg">
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center pb-3 border-b">
                                    <span className="text-gray-700 font-medium">Subtotal</span>
                                    <span className="text-xl font-bold text-gray-800">${calculateTotal()}</span>
                                </div>

                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <div className="flex items-center gap-2 text-green-700">
                                        <AlertCircle className="h-5 w-5" />
                                        <span className="font-semibold">You're helping reduce food waste!</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-sm text-gray-600">
                                    <span>Total Items:</span>
                                    <span className="font-semibold">{items.length}</span>
                                </div>

                                <div className="pt-3 border-t">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-lg font-bold text-gray-800">Total</span>
                                        <span className="text-3xl font-bold text-green-600">
                                            ${calculateTotal()}
                                        </span>
                                    </div>

                                    <Button
                                        onClick={() => setActiveView("checkout")}
                                        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                                        variant='outline'
                                    >
                                        Proceed to Checkout
                                        <ArrowRight className="h-5 w-5" />
                                    </Button>

                                    <Button
                                        onClick={() => setActiveView("userBrowse")}
                                        variant="outline"
                                        className="w-full mt-3 border-2 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                                    >
                                        <ShoppingCart className="h-5 w-5 mr-2" />
                                        Continue Shopping
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800 text-center">
                                🔒 Secure checkout powered by industry-standard encryption
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartView;