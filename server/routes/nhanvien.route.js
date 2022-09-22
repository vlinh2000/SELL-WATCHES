var express = require('express');
var router = express.Router();
const upload = require('../multer');
const { isAuth } = require('../middleware/auth.middleware');

const nhanvienController = require('../controllers/nhanvien.controller');

router.get('/', nhanvienController.get_nhanviens);
router.get('/get_new_token', isAuth, nhanvienController.get_new_token);
// router.get('/:nhanvienID', isAuth, nhanvienController.get_nhanvien);
router.post('/', upload.single('ANH_DAI_DIEN'), nhanvienController.post_nhanviens);
router.patch('/:nhanvienID', upload.single('ANH_DAI_DIEN'), nhanvienController.patch_nhanviens);
router.delete('/:nhanvienID', nhanvienController.delete_nhanviens);

module.exports = router;