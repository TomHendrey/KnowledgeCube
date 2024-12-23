// Middleware to check if the user's role matches one of the allowed roles
const checkRole = (roles) => {
    return (req, res, next) => {
        console.log(`User Role: ${req.userRole}`); // Log user's role
        console.log(`Allowed Roles: ${roles}`); // Log allowed roles

        if (!roles.includes(req.userRole)) {
            return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
        }
        next();
    };
};

export default checkRole;
