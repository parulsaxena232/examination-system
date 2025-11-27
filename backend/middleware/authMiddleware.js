const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'exam-secret-key';

function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ error: "No token provided" });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Unauthorized" });
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  });
}

function isAdmin(req, res, next) {
  if (req.userRole !== 'admin') return res.status(403).json({ error: "Only admins allowed" });
  next();
}

module.exports = { verifyToken, isAdmin };
