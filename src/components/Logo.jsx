import SmartFoodConnectLogo from '../assets/smart-food-connect-logo.png'

const Logo = ({ onClick }) => (
    <img
        src={SmartFoodConnectLogo}
        alt="Smart Food Connect Logo"
        onClick={onClick}
        className="cursor-pointer w-48 sm:w-56 md:w-64 lg:w-72"
    />
);

export default Logo;