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

const LoginView = ({ setCurrentUser, setActiveView, setCartItems }) => {  // Add setCartItems to props
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
                setCartItems(cartResponse.items || []);
                localStorage.setItem('cartItems', JSON.stringify(cartResponse.items || []));

                setActiveView("home");
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
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Access your FoodBridge account</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                                id="email" 
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input 
                                id="password" 
                                type="password" 
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                        {loading && <p>Loading...</p>}
                    </div>
                    <Button 
                        className="w-full mt-4" 
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default LoginView;