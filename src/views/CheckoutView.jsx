import { useState } from "react";
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '../components/UIComponents';
import { CheckCircle } from 'lucide-react';


const CheckoutView = () => {
    const [formData, setFormData] = useState({
        name: '',
        cardNumber: '',
        paymentType: '',
        expiry: '',
        cvv: ''
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic validation
        if (!formData.name || !formData.cardNumber || !formData.expiry || !formData.cvv) {
            setError('Please fill in all fields');
            return;
        }
        // Simulate successful payment
        setSuccess(true);
        setError('');
    };

    if (success) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Payment Successful!</CardTitle>
                    <CardDescription>Thank you for your purchase</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center">
                        <CheckCircle className="text-green-500 w-16 h-16" />
                    </div>
                    <p className="text-center mt-4">Your order has been placed successfully.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Checkout</CardTitle>
                <CardDescription>Complete your purchase</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Name on Card</Label>
                            <Input 
                                id="name" 
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input 
                                id="cardNumber" 
                                placeholder="1234 5678 9012 3456"
                                value={formData.cardNumber}
                                onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="paymentType">Payment Type</Label>
                            <Select 
                                onValueChange={(value) => setFormData({...formData, paymentType: value})}
                            >
                                <SelectTrigger id="paymentType">
                                    <SelectValue placeholder="Select payment type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="credit">Credit Card</SelectItem>
                                    <SelectItem value="debit">Debit Card</SelectItem>
                                    <SelectItem value="paypal">PayPal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="expiry">Expiry Date</Label>
                                <Input 
                                    id="expiry" 
                                    placeholder="MM/YY"
                                    value={formData.expiry}
                                    onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="cvv">CVV</Label>
                                <Input 
                                    id="cvv" 
                                    placeholder="123"
                                    value={formData.cvv}
                                    onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    <Button className="w-full mt-4" type="submit">Complete Payment</Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default CheckoutView;