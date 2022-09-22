var express = require('express');
var router = express.Router();

const sukienController = require('../controllers/sukien.controller');

router.get('/', sukienController.get_sukiens);
router.get('/:sukienID', sukienController.get_sukien);
router.post('/', sukienController.post_sukiens);
router.patch('/:sukienID', sukienController.patch_sukiens);
router.delete('/:sukienID', sukienController.delete_sukiens);

module.exports = router;