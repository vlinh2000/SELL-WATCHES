var express = require('express');
var router = express.Router();

const diachighController = require('../controllers/diachigh.controller');

router.get('/', diachighController.get_diachighs);
router.get('/:diachighID', diachighController.get_diachigh);
router.post('/', diachighController.post_diachighs);
router.patch('/:diachighID', diachighController.patch_diachighs);
router.delete('/:diachighID', diachighController.delete_diachighs);

module.exports = router;