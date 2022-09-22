var express = require('express');
var router = express.Router();
const { isAuth } = require('../middleware/auth.middleware');
const yeuthichController = require('../controllers/yeuthich.controller');

router.get('/', isAuth, yeuthichController.get_yeuthichs);
router.get('/:yeuthichID', yeuthichController.get_yeuthich);
router.post('/', isAuth, yeuthichController.post_yeuthichs);
router.patch('/:sanphamID', yeuthichController.patch_yeuthichs);
router.delete('/:sanphamID', isAuth, yeuthichController.delete_yeuthichs);

module.exports = router;