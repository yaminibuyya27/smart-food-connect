const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white backdrop-blur-md shadow-lg border-t border-gray-200 mt-auto">
            <div className="container mx-auto px-4 py-4">
                <p className="text-gray-600 text-sm text-center">
                    &copy; {currentYear} Smart Food Connect. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
