const Logo = ({ onClick }) => (
    <svg width="200" height="50" viewBox="0 0 150 50" xmlns="http://www.w3.org/2000/svg" onClick={onClick} style={{ cursor: 'pointer' }}>
        <style>
            {`
        .logo-text { font-family: Arial, sans-serif; font-weight: bold; }
        .smart { fill: #ff8000ff; }
        .food { fill: #4CAF50; }
        .connect { fill: #2196F3; }
      `}
        </style>
        <text x="10" y="35" className="logo-text smart">Smart</text>
        <text x="60" y="35" className="logo-text food">Food</text>
        <text x="105" y="35" className="logo-text connect">Connect</text>
    </svg>
);

export default Logo;