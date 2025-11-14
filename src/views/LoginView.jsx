import { useState } from "react";
import { api } from "../services/api";
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Input,
    Label,
} from '../components/UIComponents';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';

const LoginView = ({ setCurrentUser, setActiveView, setCartItems }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Input validation
        if (!formData.email.trim() || !formData.password.trim()) {
            setError('Please fill in all fields');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }

        try {
            setLoading(true);
            const response = await api.login(formData);
            
            if (response.user && response.user._id) {
                setCurrentUser(response.user);
                localStorage.setItem('currentUser', JSON.stringify(response.user));

                const cartResponse = await api.getCart(response.user._id);
                if (cartResponse && cartResponse.items) {
                    setCartItems(cartResponse.items);
                } else {
                    setCartItems([]);
                }

                if(response.user.userType === 'shopper') {
                    setActiveView("userBrowse");
                }
                else if(response.user.userType === 'retailer') {
                    setActiveView("retailerBrowse");
                }
                else if(response.user.userType === 'charity') {
                    setActiveView("charityBrowse");
                }
                else if(response.user.userType === 'admin') {
                    setActiveView("admin");
                }

            } else {
                throw new Error('Invalid response from server');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl">
                <CardHeader>
                    <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mx-auto">
                        <LogIn className="h-10 w-10 text-blue-600" />
                    </div>
                    <div>
                        <CardTitle>Welcome Back</CardTitle>
                        <CardDescription>
                            Access your Smart Food Connect account
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-4">
                            <div className="flex flex-col space-y-2">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-blue-500" />
                                    <Label htmlFor="email">
                                        Email Address
                                    </Label>
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    disabled={loading}
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <div className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-blue-500" />
                                    <Label htmlFor="password">
                                        Password
                                    </Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <Button
                            className="w-full h-12 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                            variant="outline"
                            onClick={handleSubmit}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Logging in...
                                </>
                            ) : (
                                <>
                                    <LogIn className="h-5 w-5" />
                                    Log In
                                </>
                            )}
                        </Button>

                        <div className="text-center mt-6">
                            <p className="text-gray-600">
                                Don't have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => setActiveView('register')}
                                    className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                                >
                                    Register here
                                </button>
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginView;