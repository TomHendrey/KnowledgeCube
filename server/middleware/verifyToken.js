import jwt from 'jsonwebtoken'; // If using ES modules

// Creating middleware that checks if a request has a valid token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        console.log('No token provided');
        return res.status(400).json({ message: 'Access denied, no token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.userId || !decoded.role) {
            console.log('Token missing required claims:', decoded);
            return res.status(401).json({ message: 'Invalid token: missing required claims' });
        }

        req.userId = decoded.userId; // Extract user ID
        req.userRole = decoded.role; // Extract user role

        console.log('Authenticated User ID:', req.userId);
        console.log('Authenticated User Role:', req.userRole);

        console.log('Token successfully verified. Decoded data:', decoded);
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            console.log('Token verification failed:', err.message);

            // Handle expired token
            return res.status(401).json({ message: 'Session timed out. Please log in again.' });
        } else if (err.name === 'JsonWebTokenError') {
            // Handle invalid token
            return res.status(401).json({ message: 'Invalid token. Please log in again.' });
        }
        // Handle other errors (if any)
        return res.status(500).json({ message: 'An unexpected error occurred.' });
    }
};

export default verifyToken;
