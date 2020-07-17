const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const { sendWelcomeEmail } = require('../emails/account');
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
    res.status(200).json({ user, token });
  } catch (e) {
    // res.status(400).json({ message: 'failed to verify user credential.'})
    res.status(400).json(e);
  }
});
// SIGN OUT
router.post('/api/users/signout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.json({ status: 'signedout' });
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
    res.status(400).send({ status: 'failed to add' });
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
// GET FOLLOWERS
router.get('/api/followers', auth, async (req, res) => {
  const userId = req.user._id;
  try {
    let followers = await User.find({ 'followings.following': userId });
    followers = followers.filter(follower => {
      return follower._id.toString() !== userId.toString();
    });
    res.json(followers);
  } catch (e) {
    res.status(400).send({ status: 'failed to get followers' });
  }
});
// GET TOP GRAMMERS
router.get('/api/grammers', async (req, res) => {
  try {
    const grammers = await User.find({ $query: {}, $sortByCount: { followings: -1 } }).limit(10);
    res.json(grammers);
  } catch (e) {
    res.status(400).send({ status: 'failed to get followers' });
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
