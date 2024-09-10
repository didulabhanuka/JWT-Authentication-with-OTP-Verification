const jwt = require(`jsonwebtoken`);

module.exports = (requiredRoles) => {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            if (requiredRoles && !requiredRoles.includes(decoded.role)) {
                return res.status(403).json({ message: "Forbidden - Insufficient permissions" });
            }
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }
    };
};