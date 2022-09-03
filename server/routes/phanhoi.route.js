var express = require('express');
var router = express.Router();

const phanhoiController = require('../controllers/phanhoi.controller');

router.get('/', phanhoiController.get_phanhois);
router.get('/:phanhoiID', phanhoiController.get_phanhoi);
router.post('/', phanhoiController.post_phanhois);
router.patch('/:phanhoiID', phanhoiController.patch_phanhois);
router.delete('/:phanhoiID', phanhoiController.delete_phanhois);

module.exports = router;