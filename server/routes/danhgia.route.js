var express = require('express');
var router = express.Router();

const danhgiaController = require('../controllers/danhgia.controller');

router.get('/', danhgiaController.get_danhgias);
router.get('/:danhgiaID', danhgiaController.get_danhgia);
router.post('/', danhgiaController.post_danhgias);
router.patch('/:danhgiaID', danhgiaController.patch_danhgias);
router.delete('/:danhgiaID', danhgiaController.delete_danhgias);

module.exports = router;