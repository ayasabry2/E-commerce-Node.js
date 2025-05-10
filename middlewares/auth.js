const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied, no token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(401).json({ error: 'User not found' });
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

exports.restrictToSeller = async (req, res, next) => {
  if (!req.user.isSeller) {
    return res.status(403).json({ error: 'Access denied, not a seller' });
  }
  next();
};