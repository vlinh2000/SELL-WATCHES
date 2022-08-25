var express = require('express');
var router = express.Router();

const nhanvienController = require('../controllers/nhanvien.controller');

router.get('/', nhanvienController.get_nhanviens);
router.get('/:nhanvienID', nhanvienController.get_nhanvien);
router.post('/', nhanvienController.post_nhanviens);
router.patch('/:nhanvienID', nhanvienController.patch_nhanviens);
router.delete('/:nhanvienID', nhanvienController.delete_nhanviens);

module.exports = router;