const jwt = require('jsonwebtoken');

function checkAuth(req, res, next) {
  const token = req.cookies?.jwt; // ✅ read from cookie
  console.log("Incoming JWT cookie:", token);

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("JWT verified, payload:", decoded);
      res.locals.user = { id: decoded.userId };
    } catch (err) {
      console.error("JWT VERIFY FAILED:", err.message);
      res.locals.user = null;
    }
  } else {
    console.log("No token found.");
    res.locals.user = null;
  }

  next();
}

module.exports = checkAuth;
