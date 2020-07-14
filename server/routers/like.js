const express = require('express');
const Like = require('../models/like');
const auth = require('../middleware/auth');
const router = new express.Router();

router.patch('/api/like', auth, async (req, res) => {
  const { userId, username, postId } = req.body;
  try {
    // const findPost = await Like.findOne({ postId });
    let findPost = await Like.findOne({ postId });
    if (findPost) {
      const findLike = findPost.likes.map(like => like.userId === userId);
      if (findLike[0]) {
        findPost.likes = findPost.likes.filter(like => like.userId !== userId);
        try {
          await findPost.save();
          return res.status(201).send({ status: 'unliked' });
        } catch (e) {
          return res.status(400).send(e);
        }
      } else {
        findPost.likes = findPost.likes.concat({ userId, username });
      }
    } else {
      findPost = new Like({ postId, likes: { userId, username } });
    }
    try {
      await findPost.save();
      res.status(201).send({ status: 'liked' });
    } catch (e) {
      res.status(400).send(e);
    }
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/api/like/:postId', async (req, res) => {
  const postId = req.params.postId;
  try {
    const post = await Like.findOne({ postId });
    res.json(post.likes);
  } catch (e) {
    res.json({ status: 'no likes' });
  }
});

router.post('/api/like', async (req, res) => {
  const { userId, postId } = req.body;
  try {
    const findPost = await Like.findOne({ postId });
    if (!findPost) {
      return res.json({ status: 'did not like' });
    }
    const findLike = findPost.likes.map(like => like.userId === userId);
    if (findLike.length > 0) {
      res.json(findLike);
    } else {
      return res.json({ status: 'did not like' });
    }
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
