var express = require('express');
var router = express.Router();
const { isAuth } = require('../middleware/auth.middleware');

const diachighController = require('../controllers/diachigh.controller');

router.get('/', isAuth, diachighController.get_diachighs);
router.get('/:diachighID', diachighController.get_diachigh);
router.post('/', isAuth, diachighController.post_diachighs);
router.patch('/:diachighID', diachighController.patch_diachighs);
router.delete('/:diachighID', diachighController.delete_diachighs);

module.exports = router;