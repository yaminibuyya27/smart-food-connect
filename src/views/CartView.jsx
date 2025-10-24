import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../components/UIComponents';

const CartView = ({ items, setActiveView, removeFromCart, clearCart, loading }) => (
    <Card>
        <CardHeader>
            <CardTitle>Your Cart</CardTitle>
            <CardDescription>Review your selected items</CardDescription>
        </CardHeader>
        <CardContent>
            {items.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <>
                    {items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center mb-2">
                            <span>{item.name}</span>
                            <div className="flex items-center space-x-4">
                                <span>{item.quantity || `$${item.price}`}</span>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => removeFromCart(item.id)}
                                    disabled={loading}
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}
                    <div className="mt-4 font-bold">
                        Total: ${items.reduce((sum, item) => sum + (item.price || 0), 0)}
                    </div>
                </>
            )}
        </CardContent>
        <CardFooter className="flex space-x-2">
            <Button variant="outline" onClick={() => setActiveView("userBrowse")}>
                Continue Shopping
            </Button>
            <Button 
                variant="outline" 
                onClick={clearCart}
                disabled={items.length === 0 || loading}
            >
                Clear Cart
            </Button>
            <Button 
                className="w-full" 
                onClick={() => setActiveView("checkout")}  // Attach handleCheckout here
                disabled={items.length === 0 || loading}
            >
                Proceed to Checkout
            </Button>
        </CardFooter>
    </Card>
);

export default CartView;