const jwt = require("jsonwebtoken");

const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ message: "Unauthorized access" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Forbidden access" });
    }

    // 🔐 ADMIN CHECK
    if (decoded.role !== "admin") {
      return res.status(403).send({ message: "Admin access required" });
    }

    req.user = decoded;
    next();
  });
};

module.exports = verifyAdminToken;
