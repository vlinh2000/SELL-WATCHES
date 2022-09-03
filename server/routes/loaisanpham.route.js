var express = require('express');
var router = express.Router();

const loaisanphamController = require('../controllers/loaisanpham.controller');

router.get('/', loaisanphamController.get_loaisanphams);
router.get('/:loaisanphamID', loaisanphamController.get_loaisanpham);
router.post('/', loaisanphamController.post_loaisanphams);
router.patch('/:loaisanphamID', loaisanphamController.patch_loaisanphams);
router.delete('/:loaisanphamID', loaisanphamController.delete_loaisanphams);

module.exports = router;