const express = require('express');
const Like = require('../models/like');
const auth = require('../middleware/auth');
const router = new express.Router();

router.patch('/api/like', auth, async (req, res) => {
  const { userId, postId } = req.body;
  try {
    // const findPost = await Like.findOne({ postId });
    let findPost = await Like.findOne({ postId });
    if (findPost) {
      const findLike = findPost.likes.filter(like => like.userId.toString() === userId.toString());
      if (findLike.length > 0) {
        findPost.likes = findPost.likes.filter(like => like.userId.toString() !== userId.toString());
        try {
          await findPost.save();
          return res.status(201).send({ success: true, isLiked: false, message: 'unliked' });
        } catch (e) {
          return res.status(400).send(e);
        }
      } else {
        findPost.likes = findPost.likes.concat({ userId });
      }
    } else {
      findPost = new Like({ postId, likes: { userId } });
    }
    try {
      await findPost.save();
      return res.status(201).json({ success: true, isLiked: true, message: 'liked' });
    } catch (e) {
      return res.status(400).json({ success: false, message: 'failed to like the post' });
    }
  } catch (e) {
    return res.status(500).json({ success: false, message: 'failed to find the post' });
  }
});

router.get('/api/like/:postId', async (req, res) => {
  const postId = req.params.postId;
  try {
    const post = await Like.findOne({ postId }).populate('likes.userId').exec();
    return res.json(post.likes);
  } catch (e) {
    return res.json({ success: false, message: 'no likes' });
  }
});

router.post('/api/like', async (req, res) => {
  const { userId, postId } = req.body;
  try {
    const findPost = await Like.findOne({ postId });
    if (!findPost) {
      return res.json({ success: false, message: 'did not like' });
    }
    const findLike = findPost.likes.filter(like => like.userId.toString() === userId.toString());
    if (findLike.length > 0) {
      return res.json({ success: true, isLiked: true, message: 'liked' });
    } else {
      return res.json({ success: false, message: 'did not like' });
    }
  } catch (e) {
    return res.status(500).send();
  }
});

module.exports = router;
