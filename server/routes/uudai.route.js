var express = require('express');
var router = express.Router();
const { isAuth } = require('../middleware/auth.middleware');

const uudaiController = require('../controllers/uudai.controller');

router.get('/', isAuth, uudaiController.get_uudais);
router.get('/:uudaiID', uudaiController.get_uudai);
router.post('/', isAuth, uudaiController.post_uudais);
router.patch('/:uudaiID', uudaiController.patch_uudais);
router.delete('/:uudaiID', uudaiController.delete_uudais);

module.exports = router;