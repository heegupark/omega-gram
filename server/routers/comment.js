const express = require('express');
const Comment = require('../models/comment');
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/api/comment', auth, async (req, res) => {
  const io = req.app.get('socketio');
  const { postId, comment } = req.body;
  const userId = req.user._id;
  try {
    let findComment = await Comment.findOne({ postId });
    if (findComment) {
      findComment.comments = findComment.comments.concat({ userId, comment });
      // await findComment.save();
    } else {
      findComment = new Comment({ postId, comments: { userId, comment } });
      // await findComment.save();
    }
    try {
      await findComment.save();
      const result = await Comment.findOne({ postId }).populate('comments.userId').exec();
      res.status(201).json({ success: true, comments: result.comments });
      io.on('connection', socket => {
        // eslint-disable-next-line no-console
        console.log('New Socket connection');
        socket.on('comments', (options, callback) => {
          io.emit('comments', {
            comments: result.comments
          });
        });
      });
    } catch (e) {
      res.status(400).json({ success: false, message: 'failed to comment' });
    }
  } catch (e) {
    res.status(500).json({ success: false, message: 'failed to make a comment' });
  }
});

router.get('/api/comments/:postId', auth, async (req, res) => {
  const io = req.app.get('socketio');
  const { postId } = req.params;
  try {
    const findComments = await Comment.findOne({ postId }).populate('comments.userId').exec();
    if (!findComments) {
      return res.json({ success: false, message: 'no comments' });
    }
    res.status(200).json({ success: true, comments: findComments.comments });
    io.on('connection', socket => {
      // eslint-disable-next-line no-console
      console.log('New Socket connection');
      socket.on('comments', (options, callback) => {
        io.emit('comments', {
          comments: findComments.comments
        });
      });
    });
  } catch (e) {
    res.status(500).json({ success: false, message: 'failed to find comments' });
  }
});

module.exports = router;
