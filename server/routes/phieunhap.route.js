var express = require('express');
var router = express.Router();

const phieunhapController = require('../controllers/phieunhap.controller');

router.get('/', phieunhapController.get_phieunhaps);
router.get('/:phieunhapID', phieunhapController.get_phieunhap);
router.post('/', phieunhapController.post_phieunhaps);
router.patch('/:phieunhapID', phieunhapController.patch_phieunhaps);
router.delete('/:phieunhapID', phieunhapController.delete_phieunhaps);

module.exports = router;