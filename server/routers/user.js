const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const { sendWelcomeEmail } = require('../emails/account');
const Gram = require('../models/gram');
const router = new express.Router();
// SIGN UP
router.post('/api/users', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    sendWelcomeEmail(user.email);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});
// GUEST SIGN UP/IN
router.get('/api/guest', async (req, res) => {
  const number = (Math.floor(100000 + Math.random() * 900000)).toString().substring(-2);
  const username = `guest${number}`;
  const user = new User({ username, email: `${username}@heegu.net`, password: username });
  try {
    // user.followings = user.followings.concat({ following: user._id });
    // await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ success: true, user, token });
  } catch (e) {
    res.status(400).send({ success: false, message: 'failed to create a guest account. please try later.' });
  }
});
// SIGN IN
router.post('/api/users/signin', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(200).json({ success: true, user, token });
  } catch (e) {
    // res.status(400).json({ message: 'failed to verify user credential.'})
    res.status(400).json({ success: false, message: e.message });
  }
});
// SIGN OUT
router.post('/api/users/signout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.json({ success: true, message: 'signedout' });
  } catch (e) {
    res.status(500).send(e);
  }
});
// CHECK SIGNIN
router.get('/api/users/me', auth, async (req, res) => {
  res.send(req.user);
});
// USER INFORMATION CHANGE
router.patch('/api/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['username', 'email', 'password'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }
  try {
    const user = await User.findOne({ _id: req.user._id }).populate('followings.following').exec();
    if (!user) {
      return res.status(404).send();
    }
    // eslint-disable-next-line no-return-assign
    updates.forEach(update => {
      if (req.body[update]) {
        user[update] = req.body[update];
      }
    });
    await user.save();
    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
});
// USER PASSWORD CHANGE
router.post('/api/users/password', auth, async (req, res) => {
  const { newPassword } = req.body;
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ success: false, message: 'failed to find a user' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'successfully changed' });
  } catch (e) {
    res.status(500).json();
  }
});
// FOLLOW
router.post('/api/following', auth, async (req, res) => {
  const { following } = req.body;
  const userId = req.user._id;
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ success: false, message: '/api/addfollowing: failed to find a user' });
    }
    user.followings = user.followings.concat({ following });
    await user.save();
    const newUser = await User.findOne({ _id: userId }).populate('followings.following').exec();
    // const newUser = await User.findOne({ _id: userId });
    res.json(newUser);
  } catch (e) {
    return res.status(400).send({ status: 'failed to add' });
  }
});
// STOP FOLLOW
router.post('/api/stopfollowing', auth, async (req, res) => {
  // const { following } = req.body;
  const userId = req.user._id;
  try {
    const user = await User.findOne({ _id: userId }).populate('followings.following').exec();
    user.followings = user.followings.filter(following => {
      return following.following._id.toString() !== req.body.following.toString();
    });
    await user.save();
    res.json(user);
  } catch (e) {
    res.status(400).send({ status: 'failed to unfollow' });
  }
});
// GET MY FOLLOWERS
router.get('/api/followers', auth, async (req, res) => {
  const userId = req.user._id;
  try {
    // let followers = await User.find({ 'followings.following': userId });
    const followers = await User.aggregate([
      { $unwind: '$followings' },
      { $match: { 'followings.following': userId } },
      {
        $lookup:
        {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo'
        }
      }
    ]).exec();
    return res.json(followers);
  } catch (e) {
    return res.status(400).send({ success: false, message: 'failed to get followers' });
  }
});
// GET TOP GRAMMERS
router.get('/api/grammers', auth, async (req, res) => {
  const userId = req.user._id;
  const limit = req.query.limit;
  const skip = req.query.skip;
  try {
    const user = await User.findById(userId);
    const followings = [];
    user.followings.map(following => followings.push(following.following));
    const grammers = await Gram.aggregate([
      { $group: { _id: '$owner', count: { $sum: 1 } } },
      { $match: { _id: { $nin: [userId] } } },
      { $match: { _id: { $nin: followings } } },
      {
        $lookup:
        {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $sort: { count: -1 } }
    ]).limit(Number(limit)).skip(Number(skip)).exec();
    if (!grammers) {
      return res.status(400).json({ success: false, message: 'failed to find top grammers' });
    }
    res.json({ success: true, data: grammers });
  } catch (e) {
    return res.status(500).send({ success: false, message: 'failed to get followers' });
  }
});
// GET TOP FOLLOWERS
router.get('/api/topfollowings', auth, async (req, res) => {
  const userId = req.user._id;
  const limit = req.query.limit;
  const skip = req.query.skip;
  try {
    const user = await User.findById(userId);
    const followings = [];
    user.followings.map(following => followings.push(following.following));
    const followers = await User.aggregate([
      { $unwind: '$followings' },
      { $group: { _id: '$followings.following', count: { $sum: 1 } } },
      { $match: { _id: { $nin: [userId] } } },
      { $match: { _id: { $nin: followings } } },
      {
        $lookup:
        {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $sort: { count: -1 } }
    ]).limit(Number(limit)).skip(Number(skip)).exec();
    if (!followers) {
      return res.status(400).json({ success: false, message: 'failed to find top followers' });
    }

    return res.json({ success: true, data: followers });
  } catch (e) {
    return res.status(500).send({ success: false, message: 'failed to get followers' });
  }
});
// FIND USERS
router.get('/api/users/:keyword', async (req, res) => {
  const keyword = req.params.keyword;
  try {
    const users = await User.find({ username: { $regex: keyword } }).populate('followings.following').exec();
    res.status(200).json(users);
  } catch (e) {
    res.status(400).json({ result: 'no results' });
  }
});
module.exports = router;
