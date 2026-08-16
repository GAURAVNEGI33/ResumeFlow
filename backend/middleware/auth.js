const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  // Get token from the headers (usually formatted as "Bearer <token>")
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ 
      success: false, 
      message: "Access Denied. No token provided." 
    });
  }

  // Extract the token part (after "Bearer ")
  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add the user data to the request object
    req.user = decodedPayload;
    
    // Move to the next middleware or controller
    next(); 
  } catch (err) {
    res.status(401).send({ 
      success: false, 
      message: "Invalid Token." 
    });
  }
}

module.exports = verifyToken;
