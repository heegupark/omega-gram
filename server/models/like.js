const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: true,
    ref: 'Gram'
  },
  likes: [{
    userId: {
      type: String,
      required: true,
      ref: 'User'
    },
    username: {
      type: String,
      required: true,
      ref: 'User'
    }
  }]
}, {
  timestamps: true
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
