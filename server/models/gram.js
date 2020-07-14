const mongoose = require('mongoose');

const gramSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  imgUrl: {
    type: String,
    required: false,
    trim: true
  },
  thumbnailImgUrl: {
    type: String,
    required: false,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Gram = mongoose.model('Gram', gramSchema);

module.exports = Gram;
