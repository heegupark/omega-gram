const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Gram'
  },
  likes: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  }]
}, {
  timestamps: true
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
