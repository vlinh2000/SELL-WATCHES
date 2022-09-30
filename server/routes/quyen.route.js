var express = require('express');
var router = express.Router();
const { isAuth } = require('../middleware/auth.middleware');

const quyenController = require('../controllers/quyen.controller');

router.get('/', isAuth, quyenController.get_quyens);
router.get('/:quyenID', quyenController.get_quyen);
router.post('/', quyenController.post_quyens);
router.patch('/:quyenID', quyenController.patch_quyens);
router.delete('/:quyenID', quyenController.delete_quyens);

module.exports = router;