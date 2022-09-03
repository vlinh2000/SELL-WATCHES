var express = require('express');
var router = express.Router();

const yeuthichController = require('../controllers/yeuthich.controller');

router.get('/', yeuthichController.get_yeuthichs);
router.get('/:yeuthichID', yeuthichController.get_yeuthich);
router.post('/', yeuthichController.post_yeuthichs);
router.patch('/:yeuthichID', yeuthichController.patch_yeuthichs);
router.delete('/:yeuthichID', yeuthichController.delete_yeuthichs);

module.exports = router;