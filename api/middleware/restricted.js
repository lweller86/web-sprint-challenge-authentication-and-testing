const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../../config/index")

module.exports = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'token required' });
    }

    if (token.startsWith('Bearer ')) {
      token = token.slice(7);
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          console.error("Verification Error:", err);
            return res.status(401).json({ message: 'token invalid' });
        }

        req.decodedToken = decoded;  // Optionally pass the decoded token to the next middleware.
        next();
    });
};
