const jwt = require('jsonwebtoken');

// auth middleware
exports.isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    // check if token is valid
    if (!token) {
      return res.status(401).json({
        message: 'No Token is available...',
      });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid Token...',
    });
  }
};
