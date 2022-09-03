var express = require('express');
var router = express.Router();

const quyenController = require('../controllers/quyen.controller');

router.get('/', quyenController.get_quyens);
router.get('/:quyenID', quyenController.get_quyen);
router.post('/', quyenController.post_quyens);
router.patch('/:quyenID', quyenController.patch_quyens);
router.delete('/:quyenID', quyenController.delete_quyens);

module.exports = router;