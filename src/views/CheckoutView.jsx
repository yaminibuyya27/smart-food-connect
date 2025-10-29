import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../components/UIComponents';
import { 
    CreditCard, 
    MapPin, 
    User, 
    Mail, 
    Phone, 
    Home, 
    CheckCircle,
    ArrowLeft,
    Lock,
    Calendar,
    ShieldCheck
} from 'lucide-react';

const CheckoutView = ({ setActiveView, cartItems = [], clearCart }) => {
    const [step, setStep] = useState('shipping'); // 'shipping', 'payment', 'confirmation'
    const [loading, setLoading] = useState(false);
    
    const [shippingInfo, setShippingInfo] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States'
    });

    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        paymentMethod: 'credit' // 'credit', 'debit', 'paypal'
    });

    const [orderId, setOrderId] = useState('');

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * (item.cartQuantity || 1)), 0).toFixed(2);
    };

    const handleShippingSubmit = (e) => {
        e.preventDefault();
        setStep('payment');
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            const newOrderId = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
            setOrderId(newOrderId);
            
            if (clearCart) clearCart();
            setStep('confirmation');
            setLoading(false);
        }, 2000);
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        return parts.length ? parts.join(' ') : value;
    };

    const formatExpiryDate = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.slice(0, 2) + (v.length > 2 ? '/' + v.slice(2, 4) : '');
        }
        return v;
    };

    if (step === 'confirmation') {
        return (
            <div className="max-w-2xl mx-auto">
                <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg">
                    <CardContent className="p-8 text-center">
                        <div className="flex justify-center mb-6">
                            <div className="bg-green-100 rounded-full p-6">
                                <CheckCircle className="h-24 w-24 text-green-600" />
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold text-gray-800 mb-3">Order Confirmed!</h1>
                        <p className="text-lg text-gray-600 mb-6">
                            Thank you for your purchase and for helping reduce food waste!
                        </p>

                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700 font-medium">Order Number:</span>
                                    <span className="text-gray-900 font-bold">{orderId}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700 font-medium">Total Amount:</span>
                                    <span className="text-2xl font-bold text-green-600">${calculateTotal()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700 font-medium">Email:</span>
                                    <span className="text-gray-900">{shippingInfo.email}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-blue-800">
                                📧 A confirmation email has been sent to <strong>{shippingInfo.email}</strong>
                            </p>
                        </div>

                        <div className="space-y-3">
                            <Button
                                onClick={() => setActiveView("userBrowse")}
                                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                                size="lg"
                            >
                                Continue Shopping
                            </Button>
                            <Button
                                onClick={() => setActiveView("home")}
                                variant="outline"
                                className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                Back to Home
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <button
                                    onClick={() => {
                                        if (step === 'payment') {
                                            setStep('shipping');
                                        } else {
                                            setActiveView('cart');
                                        }
                                    }}
                                    className="hover:bg-white/20 p-2 rounded-lg transition-colors"
                                >
                                    <ArrowLeft className="h-6 w-6" />
                                </button>
                                <h1 className="text-3xl font-bold">Checkout</h1>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-white' : 'text-blue-200'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'shipping' ? 'bg-white text-blue-600' : 'bg-blue-400'}`}>
                                        1
                                    </div>
                                    <span className="font-semibold hidden sm:inline">Shipping</span>
                                </div>
                                <div className="flex-1 h-1 bg-blue-400"></div>
                                <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-white' : 'text-blue-200'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-white text-blue-600' : 'bg-blue-400'}`}>
                                        2
                                    </div>
                                    <span className="font-semibold hidden sm:inline">Payment</span>
                                </div>
                            </div>
                        </div>

                        <CardContent className="p-6">
                            {step === 'shipping' && (
                                <form onSubmit={handleShippingSubmit} className="space-y-5">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <MapPin className="h-6 w-6 text-blue-500" />
                                        Shipping Information
                                    </h2>

                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                            <User className="h-4 w-4 text-blue-500" />
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={shippingInfo.fullName}
                                            onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                                            className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:outline-none transition-colors"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                                <Mail className="h-4 w-4 text-green-500" />
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={shippingInfo.email}
                                                onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                                                className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:outline-none transition-colors"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                                <Phone className="h-4 w-4 text-purple-500" />
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={shippingInfo.phone}
                                                onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                                                className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:outline-none transition-colors"
                                                placeholder="(555) 123-4567"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                            <Home className="h-4 w-4 text-orange-500" />
                                            Street Address
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={shippingInfo.address}
                                            onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                                            className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:outline-none transition-colors"
                                            placeholder="123 Main Street, Apt 4B"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                                            <input
                                                type="text"
                                                required
                                                value={shippingInfo.city}
                                                onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                                                className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:outline-none transition-colors"
                                                placeholder="New York"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                                            <input
                                                type="text"
                                                required
                                                value={shippingInfo.state}
                                                onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                                                className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:outline-none transition-colors"
                                                placeholder="NY"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">ZIP Code</label>
                                            <input
                                                type="text"
                                                required
                                                value={shippingInfo.zipCode}
                                                onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                                                className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:outline-none transition-colors"
                                                placeholder="10001"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                                        size="lg"
                                    >
                                        Continue to Payment
                                    </Button>
                                </form>
                            )}

                            {step === 'payment' && (
                                <form onSubmit={handlePaymentSubmit} className="space-y-5">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <CreditCard className="h-6 w-6 text-blue-500" />
                                        Payment Information
                                    </h2>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Payment Method
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setPaymentInfo({...paymentInfo, paymentMethod: 'credit'})}
                                                className={`p-4 border-2 rounded-lg transition-all ${
                                                    paymentInfo.paymentMethod === 'credit'
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <CreditCard className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                                                <span className="text-sm font-semibold">Credit Card</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setPaymentInfo({...paymentInfo, paymentMethod: 'debit'})}
                                                className={`p-4 border-2 rounded-lg transition-all ${
                                                    paymentInfo.paymentMethod === 'debit'
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <CreditCard className="h-6 w-6 mx-auto mb-2 text-green-500" />
                                                <span className="text-sm font-semibold">Debit Card</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setPaymentInfo({...paymentInfo, paymentMethod: 'paypal'})}
                                                className={`p-4 border-2 rounded-lg transition-all ${
                                                    paymentInfo.paymentMethod === 'paypal'
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <ShieldCheck className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                                                <span className="text-sm font-semibold">PayPal</span>
                                            </button>
                                        </div>
                                    </div>

                                    {(paymentInfo.paymentMethod === 'credit' || paymentInfo.paymentMethod === 'debit') && (
                                        <>
                                            <div>
                                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                                    <User className="h-4 w-4 text-blue-500" />
                                                    Cardholder Name
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={paymentInfo.cardName}
                                                    onChange={(e) => setPaymentInfo({...paymentInfo, cardName: e.target.value})}
                                                    className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:outline-none transition-colors"
                                                    placeholder="John Doe"
                                                />
                                            </div>

                                            <div>
                                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                                    <CreditCard className="h-4 w-4 text-green-500" />
                                                    Card Number
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    maxLength="19"
                                                    value={paymentInfo.cardNumber}
                                                    onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: formatCardNumber(e.target.value)})}
                                                    className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:outline-none transition-colors"
                                                    placeholder="1234 5678 9012 3456"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                                        <Calendar className="h-4 w-4 text-purple-500" />
                                                        Expiry Date
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        maxLength="5"
                                                        value={paymentInfo.expiryDate}
                                                        onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: formatExpiryDate(e.target.value)})}
                                                        className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:outline-none transition-colors"
                                                        placeholder="MM/YY"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                                        <Lock className="h-4 w-4 text-orange-500" />
                                                        CVV
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        maxLength="4"
                                                        value={paymentInfo.cvv}
                                                        onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value.replace(/\D/g, '')})}
                                                        className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:outline-none transition-colors"
                                                        placeholder="123"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {paymentInfo.paymentMethod === 'paypal' && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <p className="text-sm text-blue-800">
                                                You will be redirected to PayPal to complete your payment securely.
                                            </p>
                                        </div>
                                    )}

                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 text-green-700">
                                            <Lock className="h-5 w-5" />
                                            <span className="text-sm font-semibold">Your payment information is encrypted and secure</span>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                                        size="lg"
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                                Processing...
                                            </div>
                                        ) : (
                                            `Complete Order - $${calculateTotal()}`
                                        )}
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                                <CardTitle className="text-xl font-bold">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-3 pb-3 border-b">
                                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL || ''}/api/inventory/image/${item.id}`}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = '/placeholder-food.png';
                                                        e.target.onerror = null;
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-sm text-gray-800 truncate">{item.name}</h4>
                                                <p className="text-xs text-gray-600">Qty: {item.cartQuantity || 1}</p>
                                                <p className="text-sm font-bold text-green-600">${(item.price * (item.cartQuantity || 1)).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-3 border-t">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-700 font-medium">Subtotal</span>
                                        <span className="font-semibold text-gray-800">${calculateTotal()}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-700 font-medium">Shipping</span>
                                        <span className="font-semibold text-green-600">FREE</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-3 border-t">
                                        <span className="text-lg font-bold text-gray-800">Total</span>
                                        <span className="text-2xl font-bold text-green-600">${calculateTotal()}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutView;