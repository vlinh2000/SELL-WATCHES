var express = require('express');
var router = express.Router();

const chucvuController = require('../controllers/chucvu.controller');

router.get('/', chucvuController.get_chucvus);
router.get('/:chucvuID', chucvuController.get_chucvu);
router.post('/', chucvuController.post_chucvus);
router.patch('/:chucvuID', chucvuController.patch_chucvus);
router.delete('/:chucvuID', chucvuController.delete_chucvus);

module.exports = router;