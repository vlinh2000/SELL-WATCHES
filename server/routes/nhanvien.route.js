var express = require('express');
var router = express.Router();
const upload = require('../multer');

const nhanvienController = require('../controllers/nhanvien.controller');

router.get('/', nhanvienController.get_nhanviens);
router.get('/:nhanvienID', nhanvienController.get_nhanvien);
router.post('/', upload.single('ANH_DAI_DIEN'), nhanvienController.post_nhanviens);
router.patch('/:nhanvienID', upload.single('ANH_DAI_DIEN'), nhanvienController.patch_nhanviens);
router.delete('/:nhanvienID', nhanvienController.delete_nhanviens);

module.exports = router;