var express = require('express');
var router = express.Router();

const thuonghieuController = require('../controllers/thuonghieu.controller');

router.get('/', thuonghieuController.get_thuonghieus);
router.get('/:thuonghieuID', thuonghieuController.get_thuonghieu);
router.post('/', thuonghieuController.post_thuonghieus);
router.patch('/:thuonghieuID', thuonghieuController.patch_thuonghieus);
router.delete('/:thuonghieuID', thuonghieuController.delete_thuonghieus);

module.exports = router;