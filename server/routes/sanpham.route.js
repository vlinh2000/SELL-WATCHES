var express = require('express');
var router = express.Router();
var upload = require('../multer');

const sanphamController = require('../controllers/sanpham.controller');

router.get('/', sanphamController.get_sanphams);
router.get('/:sanphamID', sanphamController.get_sanpham);
router.post('/', upload.array('ANH_SAN_PHAM'), sanphamController.post_sanphams);
router.patch('/:sanphamID', upload.array('ANH_SAN_PHAM'), sanphamController.patch_sanphams);
router.delete('/:sanphamID', sanphamController.delete_sanphams);

module.exports = router;