const jwt = require('jsonwebtoken');

// Middleware to protect routes
const protect = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract the token from the Authorization header

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, 'paradox'); // Verify the token with the secret key
    req.user = decoded; // Add the user info from the token to the request object
    next(); // Proceed to the next middleware or route
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { protect };
