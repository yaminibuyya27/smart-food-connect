import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../components/UIComponents';

const HomeView = ({ setActiveView }) => (
    <Card>
        <CardHeader>
            <CardTitle>Welcome to Smart Food Connect Marketplace</CardTitle>
            <CardDescription>Reducing food waste, one meal at a time.</CardDescription>
        </CardHeader>
        <CardContent>
            <p>Join our mission to reduce food waste and help those in need.</p>
            <div className="grid grid-cols-3 gap-4 mt-4">
                <Card>
                    <CardHeader>
                        <CardTitle>For Retailers</CardTitle>
                    </CardHeader>
                    <CardContent>List your surplus food items</CardContent>
                    <CardFooter>
                        <Button onClick={() => setActiveView("userBrowse")}>Get Started</Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>For Shoppers</CardTitle>
                    </CardHeader>
                    <CardContent>Find discounted food near you</CardContent>
                    <CardFooter>
                        <Button onClick={() => setActiveView("userBrowse")}>Start Shopping</Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>For Charities</CardTitle>
                    </CardHeader>
                    <CardContent>Collect donations for those in need</CardContent>
                    <CardFooter>
                        <Button onClick={() => setActiveView("charityBrowse")}>Start Donating</Button>
                    </CardFooter>
                </Card>
            </div>
        </CardContent>
    </Card>
);

export default HomeView;