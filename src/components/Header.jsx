import { Button } from "./UIComponents";
import Logo from "./Logo";

const Header = ({ setActiveView, cartItemsCount, currentUser, handleLogout }) => (
    <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Logo onClick={() => setActiveView("home")} />
            <nav className="flex items-center space-x-4">
                {currentUser ? (
                    <>
                        <span className="text-gray-700">Welcome, {currentUser.name}</span>
                        <Button variant="ghost" onClick={handleLogout}>Logout</Button>
                    </>
                ) : (
                    <>
                        <Button variant="ghost" onClick={() => setActiveView("login")}>Login</Button>
                        <Button onClick={() => setActiveView("register")}>Sign Up</Button>
                    </>
                )}
                {/* <Button variant="outline" onClick={() => setActiveView("cart")}>
                    Cart ({cartItemsCount})
                </Button> */}
                {
                    currentUser && currentUser.userType === "shopkeeper"? (
                        <>
                            <Button onClick={() => setActiveView("inventory")}>Manage Inventory</Button>
                        </>
                    ) : ( <></>)
                }
            </nav>
        </div>
    </header>
);

export default Header;