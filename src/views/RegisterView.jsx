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
        console.log(formData);
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
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>Create your Smart Food Connect account</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Name</Label>
                            <Input 
                                id="name" 
                                placeholder="Enter your name" 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
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
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label>User Type</Label>
                            <RadioGroup 
                                value={formData.userType}
                                //onChange={(event) => setFormData(formData => ({...formData, userType: event.target.value}))}
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="shopper" id="shopper" name ="userType" handleOptionChange={handleOptionChange} />
                                    <Label htmlFor="shopper">Shopper</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="retailer" id="retailer" name ="userType" handleOptionChange={handleOptionChange}/>
                                    <Label htmlFor="retailer">Retailer</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="charity" id="charity" name ="userType" handleOptionChange={handleOptionChange}/>
                                    <Label htmlFor="charity">Charity</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                    </div>
                    <Button className="w-full mt-4" type="submit" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default RegisterView;