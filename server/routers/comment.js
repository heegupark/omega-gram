const express = require('express');
const Comment = require('../models/comment');
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/api/comment', auth, async (req, res) => {
  const { postId, comment } = req.body;
  const userId = req.user._id;
  const commentObj = { userId, comment };
  try {
    let findComment = await Comment.findOne({ postId });
    if (findComment) {
      findComment.comments = findComment.comments.concat(commentObj);
      // await findComment.save();
    } else {
      findComment = new Comment({ postId, comments: commentObj });
      // await findComment.save();
    }
    try {
      await findComment.save();
      // const result = await Comment.findOne({ postId, 'comments.userId': userId }).sort({ desc: -1 }).limit(1).populate('comments.userId').exec();
      const result = await (await Comment.findOne({ postId }).populate('comments.userId').sort({ 'comments.createdAt': 1 })).execPopulate();
      const newResult = result.comments.filter(comment => {
        return comment.userId._id.toString() === userId.toString();
      });
      res.status(201).send({ success: true, comments: newResult[newResult.length - 1] });
    } catch (e) {
      res.status(400).json({ success: false, message: 'failed to comment' });
    }
  } catch (e) {
    return res.status(500).json({ success: false, message: 'failed to make a comment' });
  }
});

router.get('/api/comments/:postId', auth, async (req, res) => {
  const { postId } = req.params;
  try {
    const findComments = await Comment.findOne({ postId }).populate('comments.userId').exec();
    if (!findComments) {
      return res.json({ success: false, message: 'no comments' });
    }
    res.status(200).json({ success: true, comments: findComments.comments });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'failed to find comments' });
  }
});

module.exports = router;
