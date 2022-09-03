var express = require('express');
var router = express.Router();

const userController = require('../controllers/user.controller');
const { isAuth } = require('../middleware/auth.middleware');

router.get('/', userController.get_users);
// router.get('/:userID', userController.get_user);
router.get('/getme', isAuth, userController.get_me);
router.get('/get_new_token', isAuth, userController.get_new_token);
router.post('/', userController.post_users);
router.patch('/:userID', userController.patch_users);
router.delete('/:userID', userController.delete_users);

router.post('/login', userController.login_users);

module.exports = router;