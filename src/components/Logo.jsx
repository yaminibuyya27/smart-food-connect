import SmartFoodConnectLogo from '../assets/smart-food-connect-logo.png'

const Logo = ({ onClick }) => (
    <img src={SmartFoodConnectLogo} alt="Smart Food Connect Logo" 
        onClick={onClick} style={{cursor: 'pointer', width: '25%'}}/>
);

export default Logo;