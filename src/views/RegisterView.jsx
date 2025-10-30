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
    RadioGroup,
    RadioGroupItem,
} from '../components/UIComponents';
import { User, Mail, Lock, UserPlus, Store, ShoppingCart, Heart, Loader2 } from 'lucide-react';

const RegisterView = ({ setActiveView }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        userType: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleOptionChange = (changeEvent) =>{
        setFormData({...formData, 
          userType: changeEvent.target.value
        });
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        // Validation
        if (!formData.name || !formData.email || !formData.password) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        try {
            await api.register(formData);
            setLoading(false);
            setActiveView("login"); // Redirect to login after successful registration
        } catch (err) {
            setError(err.message || 'Registration failed');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl">
                <CardHeader className="text-center space-y-4">
                    <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 rounded-full mx-auto">
                        <UserPlus className="h-10 w-10 text-green-600" />
                    </div>
                    <div>
                        <CardTitle className="text-3xl font-bold">Join Smart Food Connect</CardTitle>
                        <CardDescription className="text-base mt-2">
                            Create your account and start making a difference
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-4">
                            <div className="flex flex-col space-y-2">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-green-500" />
                                    <Label htmlFor="name" className="font-semibold">
                                        Full Name
                                    </Label>
                                </div>
                                <Input
                                    id="name"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="h-11"
                                    disabled={loading}
                                />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-green-500" />
                                    <Label htmlFor="email" className="font-semibold">
                                        Email Address
                                    </Label>
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="h-11"
                                    disabled={loading}
                                />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <div className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-green-500" />
                                    <Label htmlFor="password" className="font-semibold">
                                        Password
                                    </Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Create a strong password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    className="h-11"
                                    disabled={loading}
                                />
                            </div>

                            <div className="flex flex-col space-y-3">
                                <Label className="font-semibold text-base">I am a...</Label>
                                <RadioGroup value={formData.userType}>
                                    <div className="space-y-3">
                                        <label
                                            htmlFor="shopper"
                                            className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                                formData.userType === 'shopper'
                                                    ? 'border-green-500 bg-green-50'
                                                    : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <RadioGroupItem
                                                value="shopper"
                                                id="shopper"
                                                name="userType"
                                                handleOptionChange={handleOptionChange}
                                            />
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                                                    <ShoppingCart className="h-5 w-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <Label htmlFor="shopper" className="font-semibold cursor-pointer">
                                                        Shopper
                                                    </Label>
                                                    <p className="text-xs text-gray-500">Find discounted food items</p>
                                                </div>
                                            </div>
                                        </label>

                                        <label
                                            htmlFor="retailer"
                                            className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                                formData.userType === 'retailer'
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <RadioGroupItem
                                                value="retailer"
                                                id="retailer"
                                                name="userType"
                                                handleOptionChange={handleOptionChange}
                                            />
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                                                    <Store className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <Label htmlFor="retailer" className="font-semibold cursor-pointer">
                                                        Retailer
                                                    </Label>
                                                    <p className="text-xs text-gray-500">List surplus food items</p>
                                                </div>
                                            </div>
                                        </label>

                                        <label
                                            htmlFor="charity"
                                            className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                                formData.userType === 'charity'
                                                    ? 'border-red-500 bg-red-50'
                                                    : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <RadioGroupItem
                                                value="charity"
                                                id="charity"
                                                name="userType"
                                                handleOptionChange={handleOptionChange}
                                            />
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
                                                    <Heart className="h-5 w-5 text-red-600" />
                                                </div>
                                                <div>
                                                    <Label htmlFor="charity" className="font-semibold cursor-pointer">
                                                        Charity
                                                    </Label>
                                                    <p className="text-xs text-gray-500">Collect food donations</p>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <Button
                            className="w-full h-12 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="h-5 w-5" />
                                    Create Account
                                </>
                            )}
                        </Button>

                        <div className="text-center mt-6">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => setActiveView('login')}
                                    className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors"
                                >
                                    Login here
                                </button>
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default RegisterView;