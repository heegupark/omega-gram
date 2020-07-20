const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }).populate('followings.following').exec();
    // const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }).populate('followings.following').exec();
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Please authenticate.' });
  }
};

module.exports = auth;
