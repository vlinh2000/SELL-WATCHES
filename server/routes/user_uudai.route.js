var express = require('express');
var router = express.Router();
const { isAuth } = require('../middleware/auth.middleware');

const user_uudaiController = require('../controllers/user_uudai.controller');

router.get('/', isAuth, user_uudaiController.get_user_uudais);
// router.get('/:user_uudaiID', user_uudaiController.get_user_uudai);
router.post('/', isAuth, user_uudaiController.post_user_uudais);
// router.patch('/:user_uudaiID', user_uudaiController.patch_user_uudais);
// router.delete('/:user_uudaiID', user_uudaiController.delete_user_uudais);

module.exports = router;