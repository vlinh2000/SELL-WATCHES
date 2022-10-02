var express = require('express');
var router = express.Router();
const upload = require('../multer');

const userController = require('../controllers/user.controller');
const { isAuth } = require('../middleware/auth.middleware');

router.get('/', userController.get_users);
// router.get('/:userID', userController.get_user);
router.get('/getme', isAuth, userController.get_me);
router.get('/get_new_token', isAuth, userController.get_new_token);
router.post('/save_user_social_media', userController.save_userInfo_WithSocialMedia);
router.post('/forget_password', userController.forget_password);
router.post('/', upload.single('ANH_DAI_DIEN'), userController.post_users);
router.patch('/:userID', isAuth, upload.single('ANH_DAI_DIEN'), userController.patch_users);
router.delete('/:userID', userController.delete_users);

router.post('/login', userController.login_users);

module.exports = router;