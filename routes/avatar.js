const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const { uploadAvatar, getAvatar } = require('../controllers/avatarController');

const router = express.Router();

router.post('/upload-avatar', upload.single('avatar'), uploadAvatar);
router.get('/avatar', getAvatar);

module.exports = router;
