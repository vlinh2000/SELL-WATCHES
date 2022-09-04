var express = require('express');
var router = express.Router();

const donhangController = require('../controllers/donhang.controller');

router.get('/', donhangController.get_donhangs);
router.get('/thongkes', donhangController.get_thongkes);
router.get('/:donhangID', donhangController.get_donhang);
router.post('/', donhangController.post_donhangs);
router.patch('/:donhangID', donhangController.patch_donhangs);
router.delete('/:donhangID', donhangController.delete_donhangs);

module.exports = router;