var express = require('express');
var router = express.Router();

const danhmucController = require('../controllers/danhmuc.controller');

router.get('/', danhmucController.get_danhmucs);
router.get('/:danhmucID', danhmucController.get_danhmuc);
router.post('/', danhmucController.post_danhmucs);
router.patch('/:danhmucID', danhmucController.patch_danhmucs);
router.delete('/:danhmucID', danhmucController.delete_danhmucs);

module.exports = router;