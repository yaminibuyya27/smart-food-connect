import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../components/UIComponents';
import { api } from '../services/api';
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
    Calendar
} from 'lucide-react';

const CheckoutView = ({ setActiveView, cartItems = [], clearCart, currentUser }) => {
    const [step, setStep] = useState('shipping'); // 'shipping', 'payment', 'confirmation'
    const [loading, setLoading] = useState(false);

    const [shippingInfo, setShippingInfo] = useState({
        fullName: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States'
    });

    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: '',
        cardName: currentUser?.name || '',
        expiryDate: '',
        cvv: '',
        paymentMethod: 'credit' // 'credit', 'debit'
    });

    const [orderId, setOrderId] = useState('');
    const [orderTotal, setOrderTotal] = useState('0.00');
    const [shippingErrors, setShippingErrors] = useState({ fullName: '', email: '', phone: '', address: '', city: '', state: '', zipCode: '' });
    const [paymentErrors, setPaymentErrors] = useState({ cardName: '', cardNumber: '', expiryDate: '', cvv: '' });

    // US States and their major cities
    const US_STATES = {
        'AL': { name: 'Alabama', cities: ['Birmingham', 'Montgomery', 'Mobile', 'Huntsville', 'Tuscaloosa'] },
        'AK': { name: 'Alaska', cities: ['Anchorage', 'Fairbanks', 'Juneau', 'Sitka', 'Ketchikan'] },
        'AZ': { name: 'Arizona', cities: ['Phoenix', 'Tucson', 'Mesa', 'Chandler', 'Scottsdale'] },
        'AR': { name: 'Arkansas', cities: ['Little Rock', 'Fort Smith', 'Fayetteville', 'Springdale', 'Jonesboro'] },
        'CA': { name: 'California', cities: ['Los Angeles', 'San Diego', 'San Jose', 'San Francisco', 'Fresno', 'Sacramento'] },
        'CO': { name: 'Colorado', cities: ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins', 'Lakewood'] },
        'CT': { name: 'Connecticut', cities: ['Bridgeport', 'New Haven', 'Stamford', 'Hartford', 'Waterbury'] },
        'DE': { name: 'Delaware', cities: ['Wilmington', 'Dover', 'Newark', 'Middletown', 'Smyrna'] },
        'FL': { name: 'Florida', cities: ['Jacksonville', 'Miami', 'Tampa', 'Orlando', 'St. Petersburg'] },
        'GA': { name: 'Georgia', cities: ['Atlanta', 'Augusta', 'Columbus', 'Savannah', 'Athens'] },
        'HI': { name: 'Hawaii', cities: ['Honolulu', 'Pearl City', 'Hilo', 'Kailua', 'Waipahu'] },
        'ID': { name: 'Idaho', cities: ['Boise', 'Meridian', 'Nampa', 'Idaho Falls', 'Pocatello'] },
        'IL': { name: 'Illinois', cities: ['Chicago', 'Aurora', 'Rockford', 'Joliet', 'Naperville'] },
        'IN': { name: 'Indiana', cities: ['Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend', 'Carmel'] },
        'IA': { name: 'Iowa', cities: ['Des Moines', 'Cedar Rapids', 'Davenport', 'Sioux City', 'Iowa City'] },
        'KS': { name: 'Kansas', cities: ['Wichita', 'Overland Park', 'Kansas City', 'Topeka', 'Olathe'] },
        'KY': { name: 'Kentucky', cities: ['Louisville', 'Lexington', 'Bowling Green', 'Owensboro', 'Covington'] },
        'LA': { name: 'Louisiana', cities: ['New Orleans', 'Baton Rouge', 'Shreveport', 'Lafayette', 'Lake Charles'] },
        'ME': { name: 'Maine', cities: ['Portland', 'Lewiston', 'Bangor', 'South Portland', 'Auburn'] },
        'MD': { name: 'Maryland', cities: ['Baltimore', 'Frederick', 'Rockville', 'Gaithersburg', 'Bowie'] },
        'MA': { name: 'Massachusetts', cities: ['Boston', 'Worcester', 'Springfield', 'Cambridge', 'Lowell'] },
        'MI': { name: 'Michigan', cities: ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights', 'Ann Arbor'] },
        'MN': { name: 'Minnesota', cities: ['Minneapolis', 'St. Paul', 'Rochester', 'Duluth', 'Bloomington'] },
        'MS': { name: 'Mississippi', cities: ['Jackson', 'Gulfport', 'Southaven', 'Hattiesburg', 'Biloxi'] },
        'MO': { name: 'Missouri', cities: ['Kansas City', 'St. Louis', 'Springfield', 'Columbia', 'Independence'] },
        'MT': { name: 'Montana', cities: ['Billings', 'Missoula', 'Great Falls', 'Bozeman', 'Butte'] },
        'NE': { name: 'Nebraska', cities: ['Omaha', 'Lincoln', 'Bellevue', 'Grand Island', 'Kearney'] },
        'NV': { name: 'Nevada', cities: ['Las Vegas', 'Henderson', 'Reno', 'North Las Vegas', 'Sparks'] },
        'NH': { name: 'New Hampshire', cities: ['Manchester', 'Nashua', 'Concord', 'Derry', 'Rochester'] },
        'NJ': { name: 'New Jersey', cities: ['Newark', 'Jersey City', 'Paterson', 'Elizabeth', 'Edison'] },
        'NM': { name: 'New Mexico', cities: ['Albuquerque', 'Las Cruces', 'Rio Rancho', 'Santa Fe', 'Roswell'] },
        'NY': { name: 'New York', cities: ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse'] },
        'NC': { name: 'North Carolina', cities: ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem'] },
        'ND': { name: 'North Dakota', cities: ['Fargo', 'Bismarck', 'Grand Forks', 'Minot', 'West Fargo'] },
        'OH': { name: 'Ohio', cities: ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron'] },
        'OK': { name: 'Oklahoma', cities: ['Oklahoma City', 'Tulsa', 'Norman', 'Broken Arrow', 'Lawton'] },
        'OR': { name: 'Oregon', cities: ['Portland', 'Salem', 'Eugene', 'Gresham', 'Hillsboro'] },
        'PA': { name: 'Pennsylvania', cities: ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading'] },
        'RI': { name: 'Rhode Island', cities: ['Providence', 'Warwick', 'Cranston', 'Pawtucket', 'East Providence'] },
        'SC': { name: 'South Carolina', cities: ['Columbia', 'Charleston', 'North Charleston', 'Mount Pleasant', 'Rock Hill'] },
        'SD': { name: 'South Dakota', cities: ['Sioux Falls', 'Rapid City', 'Aberdeen', 'Brookings', 'Watertown'] },
        'TN': { name: 'Tennessee', cities: ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga', 'Clarksville'] },
        'TX': { name: 'Texas', cities: ['Houston', 'San Antonio', 'Dallas', 'Austin', 'Fort Worth'] },
        'UT': { name: 'Utah', cities: ['Salt Lake City', 'West Valley City', 'Provo', 'West Jordan', 'Orem'] },
        'VT': { name: 'Vermont', cities: ['Burlington', 'South Burlington', 'Rutland', 'Barre', 'Montpelier'] },
        'VA': { name: 'Virginia', cities: ['Virginia Beach', 'Norfolk', 'Chesapeake', 'Richmond', 'Newport News'] },
        'WA': { name: 'Washington', cities: ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue'] },
        'WV': { name: 'West Virginia', cities: ['Charleston', 'Huntington', 'Morgantown', 'Parkersburg', 'Wheeling'] },
        'WI': { name: 'Wisconsin', cities: ['Milwaukee', 'Madison', 'Green Bay', 'Kenosha', 'Racine'] },
        'WY': { name: 'Wyoming', cities: ['Cheyenne', 'Casper', 'Laramie', 'Gillette', 'Rock Springs'] }
    };

    const getAvailableCities = () => {
        if (!shippingInfo.state || !US_STATES[shippingInfo.state]) {
            return [];
        }
        return US_STATES[shippingInfo.state].cities;
    };

    const isCharityItem = (item) => {
        return item.type === 'charity';
    };

    const hasOnlyCharityItems = () => {
        return cartItems.length > 0 && cartItems.every(item => isCharityItem(item));
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            // Charity items are free
            const itemPrice = isCharityItem(item) ? 0 : item.price;
            return total + (itemPrice * (item.cartQuantity || 1));
        }, 0).toFixed(2);
    };

    const validateShipping = () => {
        const errors = {};

        if (!shippingInfo.fullName.trim()) {
            errors.fullName = 'Full name is required';
        } else if (shippingInfo.fullName.trim().length < 2) {
            errors.fullName = 'Name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(shippingInfo.fullName)) {
            errors.fullName = 'Name can only contain letters and spaces';
        }

        if (!shippingInfo.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (!shippingInfo.phone.trim()) {
            errors.phone = 'Phone number is required';
        } else {
            const phoneDigits = shippingInfo.phone.replace(/\D/g, '');
            if (phoneDigits.length < 10) {
                errors.phone = 'Phone number must be at least 10 digits';
            }
        }

        if (!shippingInfo.address.trim()) {
            errors.address = 'Street address is required';
        } else if (shippingInfo.address.trim().length < 5) {
            errors.address = 'Please enter a complete address';
        }

        if (!shippingInfo.city.trim()) {
            errors.city = 'City is required';
        } else if (shippingInfo.city.trim().length < 2) {
            errors.city = 'Please enter a valid city name';
        }

        if (!shippingInfo.state.trim()) {
            errors.state = 'State is required';
        } else if (!US_STATES[shippingInfo.state]) {
            errors.state = 'Please select a valid state';
        }

        if (!shippingInfo.zipCode.trim()) {
            errors.zipCode = 'ZIP code is required';
        } else if (!/^\d{5}(-\d{4})?$/.test(shippingInfo.zipCode.trim())) {
            errors.zipCode = 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)';
        }

        return errors;
    };

    const validatePayment = () => {
        const errors = {};

        if (!paymentInfo.cardName.trim()) {
            errors.cardName = 'Cardholder name is required';
        } else if (paymentInfo.cardName.trim().length < 2) {
            errors.cardName = 'Name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(paymentInfo.cardName)) {
            errors.cardName = 'Name can only contain letters and spaces';
        }

        if (!paymentInfo.cardNumber.trim()) {
            errors.cardNumber = 'Card number is required';
        } else {
            const cardDigits = paymentInfo.cardNumber.replace(/\s/g, '');
            if (!/^\d{13,19}$/.test(cardDigits)) {
                errors.cardNumber = 'Please enter a valid card number (13-19 digits)';
            }
        }

        if (!paymentInfo.expiryDate.trim()) {
            errors.expiryDate = 'Expiry date is required';
        } else if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) {
            errors.expiryDate = 'Format must be MM/YY';
        } else {
            const [month, year] = paymentInfo.expiryDate.split('/');
            const monthNum = parseInt(month, 10);
            const yearNum = parseInt('20' + year, 10);
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth() + 1;

            if (monthNum < 1 || monthNum > 12) {
                errors.expiryDate = 'Invalid month (must be 01-12)';
            } else if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
                errors.expiryDate = 'Card has expired';
            }
        }

        if (!paymentInfo.cvv.trim()) {
            errors.cvv = 'CVV is required';
        } else if (!/^\d{3,4}$/.test(paymentInfo.cvv)) {
            errors.cvv = 'CVV must be 3 or 4 digits';
        }

        return errors;
    };

    const handleShippingSubmit = async (e) => {
        e.preventDefault();
        const errors = validateShipping();
        setShippingErrors(errors);

        if (Object.keys(errors).length === 0) {
            // Skip payment for charity-only orders
            if (hasOnlyCharityItems()) {
                await handleCharityOrderSubmit();
            } else {
                setStep('payment');
            }
        }
    };

    const handleCharityOrderSubmit = async () => {
        setLoading(true);

        try {
            const orderItems = cartItems.map(item => ({
                itemId: item.id,
                product: item.name,
                quantity: item.cartQuantity || 1,
                price: 0 // Charity items are free
            }));

            const orderData = {
                userId: currentUser._id,
                items: orderItems,
                totalAmount: 0,
                paymentMethod: 'donation', // Special payment method for charity items
                shippingAddress: {
                    street: shippingInfo.address,
                    city: shippingInfo.city,
                    state: shippingInfo.state,
                    zipCode: shippingInfo.zipCode,
                    country: shippingInfo.country
                },
                status: 'completed'
            };

            const response = await api.createOrder(orderData);

            if (response && response.order) {
                setOrderId(response.order._id);
                setOrderTotal('0.00');

                if (clearCart) clearCart();

                setStep('confirmation');
            }
        } catch (error) {
            console.error('Error creating charity order:', error);
            alert('Failed to create order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        const errors = validatePayment();
        setPaymentErrors(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }

        setLoading(true);

        try {
            const orderItems = cartItems.map(item => ({
                itemId: item.id,
                product: item.name,
                quantity: item.cartQuantity || 1,
                price: isCharityItem(item) ? 0 : item.price // Charity items are free
            }));

            const total = parseFloat(calculateTotal());

            const orderData = {
                userId: currentUser._id,
                items: orderItems,
                totalAmount: total,
                paymentMethod: paymentInfo.paymentMethod === 'credit' ? 'card' : 'card',
                shippingAddress: {
                    street: shippingInfo.address,
                    city: shippingInfo.city,
                    state: shippingInfo.state,
                    zipCode: shippingInfo.zipCode,
                    country: shippingInfo.country
                },
                status: 'completed'
            };

            const response = await api.createOrder(orderData);

            if (response && response.order) {
                setOrderId(response.order._id);
                setOrderTotal(total.toFixed(2));

                if (clearCart) clearCart();

                setStep('confirmation');
            }
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Failed to create order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatPhoneNumber = (value) => {
        const digits = value.replace(/\D/g, '');
        const limited = digits.slice(0, 10);

        if (limited.length <= 3) {
            return limited;
        } else if (limited.length <= 6) {
            return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
        } else {
            return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
        }
    };

    const formatCardNumber = (value) => {
        const digits = value.replace(/\D/g, '');
        const limited = digits.slice(0, 16);
        
        const parts = [];
        for (let i = 0; i < limited.length; i += 4) {
            parts.push(limited.substring(i, i + 4));
        }

        return parts.join(' ');
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
                    <CardContent>
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
                                    <span className="text-2xl font-bold text-green-600">${orderTotal}</span>
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
                                variant='outline'
                            >
                                Continue Shopping
                            </Button>
                            <Button
                                onClick={() => setActiveView("home")}
                                variant="outline"
                                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
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

                        <CardContent>
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
                                            value={shippingInfo.fullName}
                                            onChange={(e) => {
                                                setShippingInfo({ ...shippingInfo, fullName: e.target.value });
                                                if (shippingErrors.fullName) {
                                                    setShippingErrors({ ...shippingErrors, fullName: '' });
                                                }
                                            }}
                                            className={`w-full p-3 border-2 rounded-lg bg-white focus:outline-none transition-colors ${
                                                shippingErrors.fullName
                                                    ? 'border-red-500 focus:border-red-500'
                                                    : 'border-gray-200 focus:border-blue-500'
                                            }`}
                                            placeholder="John Doe"
                                        />
                                        {shippingErrors.fullName && (
                                            <p className="text-red-600 text-sm mt-1">{shippingErrors.fullName}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                                <Mail className="h-4 w-4 text-green-500" />
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                value={shippingInfo.email}
                                                onChange={(e) => {
                                                    setShippingInfo({ ...shippingInfo, email: e.target.value });
                                                    if (shippingErrors.email) {
                                                        setShippingErrors({ ...shippingErrors, email: '' });
                                                    }
                                                }}
                                                className={`w-full p-3 border-2 rounded-lg bg-white focus:outline-none transition-colors ${
                                                    shippingErrors.email
                                                        ? 'border-red-500 focus:border-red-500'
                                                        : 'border-gray-200 focus:border-blue-500'
                                                }`}
                                                placeholder="john@example.com"
                                            />
                                            {shippingErrors.email && (
                                                <p className="text-red-600 text-sm mt-1">{shippingErrors.email}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                                <Phone className="h-4 w-4 text-purple-500" />
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                value={shippingInfo.phone}
                                                onChange={(e) => {
                                                    setShippingInfo({ ...shippingInfo, phone: formatPhoneNumber(e.target.value) });
                                                    if (shippingErrors.phone) {
                                                        setShippingErrors({ ...shippingErrors, phone: '' });
                                                    }
                                                }}
                                                className={`w-full p-3 border-2 rounded-lg bg-white focus:outline-none transition-colors ${
                                                    shippingErrors.phone
                                                        ? 'border-red-500 focus:border-red-500'
                                                        : 'border-gray-200 focus:border-blue-500'
                                                }`}
                                                placeholder="(555) 123-4567"
                                                maxLength={14}
                                            />
                                            {shippingErrors.phone && (
                                                <p className="text-red-600 text-sm mt-1">{shippingErrors.phone}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                            <Home className="h-4 w-4 text-orange-500" />
                                            Street Address
                                        </label>
                                        <input
                                            type="text"
                                            value={shippingInfo.address}
                                            onChange={(e) => {
                                                setShippingInfo({ ...shippingInfo, address: e.target.value });
                                                if (shippingErrors.address) {
                                                    setShippingErrors({ ...shippingErrors, address: '' });
                                                }
                                            }}
                                            className={`w-full p-3 border-2 rounded-lg bg-white focus:outline-none transition-colors ${
                                                shippingErrors.address
                                                    ? 'border-red-500 focus:border-red-500'
                                                    : 'border-gray-200 focus:border-blue-500'
                                            }`}
                                            placeholder="123 Main Street, Apt 4B"
                                        />
                                        {shippingErrors.address && (
                                            <p className="text-red-600 text-sm mt-1">{shippingErrors.address}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                                            <select
                                                value={shippingInfo.state}
                                                onChange={(e) => {
                                                    setShippingInfo({ ...shippingInfo, state: e.target.value, city: '' });
                                                    if (shippingErrors.state) {
                                                        setShippingErrors({ ...shippingErrors, state: '' });
                                                    }
                                                    if (shippingErrors.city) {
                                                        setShippingErrors({ ...shippingErrors, city: '' });
                                                    }
                                                }}
                                                className={`w-full p-3 border-2 rounded-lg bg-white focus:outline-none transition-colors ${
                                                    shippingErrors.state
                                                        ? 'border-red-500 focus:border-red-500'
                                                        : 'border-gray-200 focus:border-blue-500'
                                                }`}
                                            >
                                                <option value="">Select State</option>
                                                {Object.keys(US_STATES).sort().map(code => (
                                                    <option key={code} value={code}>
                                                        {code} - {US_STATES[code].name}
                                                    </option>
                                                ))}
                                            </select>
                                            {shippingErrors.state && (
                                                <p className="text-red-600 text-sm mt-1">{shippingErrors.state}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                                            <select
                                                value={shippingInfo.city}
                                                onChange={(e) => {
                                                    setShippingInfo({ ...shippingInfo, city: e.target.value });
                                                    if (shippingErrors.city) {
                                                        setShippingErrors({ ...shippingErrors, city: '' });
                                                    }
                                                }}
                                                disabled={!shippingInfo.state}
                                                className={`w-full p-3 border-2 rounded-lg bg-white focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                                                    shippingErrors.city
                                                        ? 'border-red-500 focus:border-red-500'
                                                        : 'border-gray-200 focus:border-blue-500'
                                                }`}
                                            >
                                                <option value="">
                                                    {shippingInfo.state ? 'Select City' : 'Select State First'}
                                                </option>
                                                {getAvailableCities().map(city => (
                                                    <option key={city} value={city}>
                                                        {city}
                                                    </option>
                                                ))}
                                            </select>
                                            {shippingErrors.city && (
                                                <p className="text-red-600 text-sm mt-1">{shippingErrors.city}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">ZIP Code</label>
                                            <input
                                                type="text"
                                                value={shippingInfo.zipCode}
                                                onChange={(e) => {
                                                    setShippingInfo({ ...shippingInfo, zipCode: e.target.value });
                                                    if (shippingErrors.zipCode) {
                                                        setShippingErrors({ ...shippingErrors, zipCode: '' });
                                                    }
                                                }}
                                                className={`w-full p-3 border-2 rounded-lg bg-white focus:outline-none transition-colors ${
                                                    shippingErrors.zipCode
                                                        ? 'border-red-500 focus:border-red-500'
                                                        : 'border-gray-200 focus:border-blue-500'
                                                }`}
                                                placeholder="10001"
                                                maxLength={10}
                                            />
                                            {shippingErrors.zipCode && (
                                                <p className="text-red-600 text-sm mt-1">{shippingErrors.zipCode}</p>
                                            )}
                                        </div>
                                    </div>

                                    {hasOnlyCharityItems() && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                            <p className="text-sm text-green-800 font-semibold">
                                                🎁 You're receiving charity items - No payment required!
                                            </p>
                                            <p className="text-xs text-green-700 mt-1">
                                                Just confirm your delivery address to complete your order.
                                            </p>
                                        </div>
                                    )}

                                    <Button
                                        onClick={handleShippingSubmit}
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                                        variant='outline'
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                                Processing...
                                            </div>
                                        ) : hasOnlyCharityItems() ? (
                                            'Complete Order'
                                        ) : (
                                            'Continue to Payment'
                                        )}
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
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setPaymentInfo({ ...paymentInfo, paymentMethod: 'credit' })}
                                                className={`p-4 border-2 rounded-lg transition-all ${paymentInfo.paymentMethod === 'credit'
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <CreditCard className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                                                <span className="text-sm font-semibold">Credit Card</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setPaymentInfo({ ...paymentInfo, paymentMethod: 'debit' })}
                                                className={`p-4 border-2 rounded-lg transition-all ${paymentInfo.paymentMethod === 'debit'
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <CreditCard className="h-6 w-6 mx-auto mb-2 text-green-500" />
                                                <span className="text-sm font-semibold">Debit Card</span>
                                            </button>
                                        </div>
                                    </div>
                                            <div>
                                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                                    <User className="h-4 w-4 text-blue-500" />
                                                    Cardholder Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={paymentInfo.cardName}
                                                    onChange={(e) => {
                                                        setPaymentInfo({ ...paymentInfo, cardName: e.target.value });
                                                        if (paymentErrors.cardName) {
                                                            setPaymentErrors({ ...paymentErrors, cardName: '' });
                                                        }
                                                    }}
                                                    className={`w-full p-3 border-2 rounded-lg bg-white focus:outline-none transition-colors ${
                                                        paymentErrors.cardName
                                                            ? 'border-red-500 focus:border-red-500'
                                                            : 'border-gray-200 focus:border-blue-500'
                                                    }`}
                                                    placeholder="John Doe"
                                                />
                                                {paymentErrors.cardName && (
                                                    <p className="text-red-600 text-sm mt-1">{paymentErrors.cardName}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                                    <CreditCard className="h-4 w-4 text-green-500" />
                                                    Card Number
                                                </label>
                                                <input
                                                    type="text"
                                                    maxLength={19}
                                                    value={paymentInfo.cardNumber}
                                                    onChange={(e) => {
                                                        setPaymentInfo({ ...paymentInfo, cardNumber: formatCardNumber(e.target.value) });
                                                        if (paymentErrors.cardNumber) {
                                                            setPaymentErrors({ ...paymentErrors, cardNumber: '' });
                                                        }
                                                    }}
                                                    className={`w-full p-3 border-2 rounded-lg bg-white focus:outline-none transition-colors ${
                                                        paymentErrors.cardNumber
                                                            ? 'border-red-500 focus:border-red-500'
                                                            : 'border-gray-200 focus:border-blue-500'
                                                    }`}
                                                    placeholder="1234 5678 9012 3456"
                                                />
                                                {paymentErrors.cardNumber && (
                                                    <p className="text-red-600 text-sm mt-1">{paymentErrors.cardNumber}</p>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                                        <Calendar className="h-4 w-4 text-purple-500" />
                                                        Expiry Date
                                                    </label>
                                                    <input
                                                        type="text"
                                                        maxLength={5}
                                                        value={paymentInfo.expiryDate}
                                                        onChange={(e) => {
                                                            setPaymentInfo({ ...paymentInfo, expiryDate: formatExpiryDate(e.target.value) });
                                                            if (paymentErrors.expiryDate) {
                                                                setPaymentErrors({ ...paymentErrors, expiryDate: '' });
                                                            }
                                                        }}
                                                        className={`w-full p-3 border-2 rounded-lg bg-white focus:outline-none transition-colors ${
                                                            paymentErrors.expiryDate
                                                                ? 'border-red-500 focus:border-red-500'
                                                                : 'border-gray-200 focus:border-blue-500'
                                                        }`}
                                                        placeholder="MM/YY"
                                                    />
                                                    {paymentErrors.expiryDate && (
                                                        <p className="text-red-600 text-sm mt-1">{paymentErrors.expiryDate}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                                        <Lock className="h-4 w-4 text-orange-500" />
                                                        CVV
                                                    </label>
                                                    <input
                                                        type="text"
                                                        maxLength={4}
                                                        value={paymentInfo.cvv}
                                                        onChange={(e) => {
                                                            setPaymentInfo({ ...paymentInfo, cvv: e.target.value.replace(/\D/g, '') });
                                                            if (paymentErrors.cvv) {
                                                                setPaymentErrors({ ...paymentErrors, cvv: '' });
                                                            }
                                                        }}
                                                        className={`w-full p-3 border-2 rounded-lg bg-white focus:outline-none transition-colors ${
                                                            paymentErrors.cvv
                                                                ? 'border-red-500 focus:border-red-500'
                                                                : 'border-gray-200 focus:border-blue-500'
                                                        }`}
                                                        placeholder="123"
                                                    />
                                                    {paymentErrors.cvv && (
                                                        <p className="text-red-600 text-sm mt-1">{paymentErrors.cvv}</p>
                                                    )}
                                                </div>
                                            </div>

                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 text-green-700">
                                            <Lock className="h-5 w-5" />
                                            <span className="text-sm font-semibold">Your payment information is encrypted and secure</span>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handlePaymentSubmit}
                                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                                        variant='outline'
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
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                    {cartItems.map((item) => {
                                        const itemPrice = isCharityItem(item) ? 0 : item.price;
                                        const itemTotal = (itemPrice * (item.cartQuantity || 1)).toFixed(2);
                                        return (
                                            <div key={item.id} className="flex gap-3 pb-3 border-b">
                                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-sm text-gray-800 truncate">{item.name}</h4>
                                                    <p className="text-xs text-gray-600">Qty: {item.cartQuantity || 1}</p>
                                                    {isCharityItem(item) ? (
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-sm font-bold text-green-600">FREE</p>
                                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">Charity</span>
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm font-bold text-green-600">${itemTotal}</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
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