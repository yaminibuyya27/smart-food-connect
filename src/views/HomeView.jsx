import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../components/UIComponents';
import { Store, ShoppingCart, Heart } from 'lucide-react';

const HomeView = ({ setActiveView }) => (
    <div className="w-full max-w-7xl mx-auto">
        <Card className="mb-8 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                    Welcome to Smart Food Connect Marketplace
                </CardTitle>
                <CardDescription className="text-lg sm:text-xl">
                    Reducing food waste, one meal at a time.
                </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-base sm:text-lg text-gray-600 mb-6">
                    Join our mission to reduce food waste and help those in need.
                </p>
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card className="flex flex-col bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl hover:border-gray-300 transition-all duration-300">
                <CardHeader>
                    <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 mx-auto">
                        <Store className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl text-center">For Retailers</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow text-center">
                    <p className="text-gray-600">
                        List your surplus food items and reduce waste while earning revenue
                    </p>
                </CardContent>
                <CardFooter className="pt-4">
                    <Button 
                        onClick={() => setActiveView("retailerBrowse")} 
                        className="w-full inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                        size="lg"
                    >
                        <Store className="h-5 w-5 mr-2" />
                        Get Started
                    </Button>
                </CardFooter>
            </Card>

            <Card className="flex flex-col bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl hover:border-gray-300 transition-all duration-300">
                <CardHeader>
                    <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 mx-auto">
                        <ShoppingCart className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-xl text-center">For Shoppers</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow text-center">
                    <p className="text-gray-600">
                        Find discounted food near you and save money on quality items
                    </p>
                </CardContent>
                <CardFooter className="pt-4">
                    <Button 
                        onClick={() => setActiveView("userBrowse")} 
                        className="w-full inline-flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                        size="lg"
                    >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Start Shopping
                    </Button>
                </CardFooter>
            </Card>

            <Card className="flex flex-col bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl hover:border-gray-300 transition-all duration-300 md:col-span-2 lg:col-span-1">
                <CardHeader>
                    <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4 mx-auto">
                        <Heart className="h-8 w-8 text-red-600" />
                    </div>
                    <CardTitle className="text-xl text-center">For Charities</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow text-center">
                    <p className="text-gray-600">
                        Collect donations for those in need and support your community
                    </p>
                </CardContent>
                <CardFooter className="pt-4">
                    <Button 
                        onClick={() => setActiveView("charityBrowse")} 
                        className="w-full inline-flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                        size="lg"
                    >
                        <Heart className="h-5 w-5 mr-2" />
                        Start Donating
                    </Button>
                </CardFooter>
            </Card>
        </div>
    </div>
);

export default HomeView;