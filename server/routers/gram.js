const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const Gram = require('../models/gram');
const auth = require('../middleware/auth');
const User = require('../models/user');
const router = new express.Router();
// POSTING
router.post('/api/gram', auth, async (req, res) => {
  const owner = req.user._id;

  try {
    const user = await User.findOne({ _id: owner });
    if (!user) {
      return res.status(404).send();
    }
    const gram = new Gram({
      ...req.body,
      owner: user
    });
    await gram.save();
    // const newgram = await Gram.findOne({ ...req.body, owner }).populate('owner').exec();
    // await newgram.save();
    res.status(201).send(gram);
  } catch (e) {
    res.status(400).send(e);
  }
});
// GET POSTS
router.get('/api/gram', auth, async (req, res) => {
  const limit = req.query.limit;
  const skip = req.query.skip;
  const sort = {};
  const followings = [];
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  }
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(400).json({ success: false, message: 'failed to find a user' });
    }
    const findFollowings = await user.followings.map(following => followings.push(following.following));
    followings.push(user._id);
    if (!findFollowings) {
      return res.status(401).json({ success: false, message: 'failed to find followings' });
    }
    const gram = await Gram.find({ owner: { $in: followings } }).sort(sort).populate('owner').limit(Number(limit)).skip(Number(skip)).exec();
    if (!gram) {
      return res.status(404).json({ success: false, message: 'failed to find posts' });
    }
    return res.json({ success: true, gram: gram });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});
// GET SPECIFIC POST
router.get('/api/gram/:id', auth, async (req, res) => {
  const limit = req.query.limit;
  const skip = req.query.skip;
  const _id = req.params.id;
  const sort = {};
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  }
  try {
    const gram = await Gram.find({ owner: _id }).sort(sort).populate('owner').limit(Number(limit)).skip(Number(skip)).exec();
    if (!gram) {
      return res.status(404).send();
    }
    return res.json({ success: true, gram: gram });
  } catch (e) {
    return res.status(500).send();
  }
});
// ADD A POST
router.post('/api/gram/image/:path', auth, (req, res) => {
  const folder = `./server/public/gram/${req.params.path}`;
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, folder);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
  const upload = multer({
    limits: {
      fileSize: 10000000
    },
    storage: storage,
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(gif|GIF|jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
        return cb(new Error('Please upload a .jpg, .gif, .jpeg, or .png file'));
      }
      cb(undefined, true);
    }
  }).single('image');
  upload(req, res, error => {
    if (error) {
      return res.status(400).json({
        message: `Failed to upload an image:${error.message}`
      });
    } else {
      try {
        sharp(req.file.path)
          .resize({ width: 300 })
          .withMetadata()
          .toFile(`${folder}/thumbnail-${req.file.filename}`);
        return res.status(201).json({
          message: 'File uploaded and resized successfully',
          filename: `thumbnail-${req.file.filename}`
        });
      } catch (error) {
        return res.status(400).json({
          message: `Failed to resize an image:${error.message}`
        });
      }
      // return res.status(200).json({ message: 'File uploaded successfully'});
    }
  });
});

router.patch('/api/gram/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'imgUrl', 'thumbnailImgUrl'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }
  try {
    const gram = await Gram.findOne({ _id: req.params.id, owner: req.user._id });
    if (!gram) {
      return res.status(404).send();
    }

    // eslint-disable-next-line no-return-assign
    updates.forEach(update => gram[update] = req.body[update]);
    await gram.save();

    res.send(gram);
  } catch (e) {
    res.status(500).send();
  }
});

router.delete('/api/gram/:id', auth, async (req, res) => {
  try {
    const gram = await Gram.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!gram) {
      return res.status(404).send();
    }
    res.send(gram);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
