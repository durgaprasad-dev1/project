const Avatar = require('../database/avatar');

exports.uploadAvatar = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).send({ success: false, message: 'userId is required' });
    }

    if (!req.file) {
      return res.status(400).send({ success: false, message: 'avatar file is required' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const existingAvatar = await Avatar.findOne({ userId });
    if (existingAvatar) {
      existingAvatar.imageUrl = imageUrl;
      await existingAvatar.save();
    } else {
      await Avatar.create({ userId, imageUrl });
    }

    res.send({ success: true, message: 'avatar uploaded', imageUrl });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: 'error uploading avatar' });
  }
};

exports.getAvatar = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).send({ success: false, message: 'userId is required' });
    }

    const avatar = await Avatar.findOne({ userId });
    if (!avatar) {
      return res.status(404).send({ success: false, message: 'avatar not found' });
    }
console.log(avatar);
    res.send({ success: true, data: avatar });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: 'error fetching avatar' });
  }
};