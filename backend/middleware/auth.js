// auth.js
import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
    // Get token from header
    const token = req.headers['x-auth-token'] || req.headers['authorization'];

    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify token
        // eslint-disable-next-line no-undef
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid', err });
    }
}
