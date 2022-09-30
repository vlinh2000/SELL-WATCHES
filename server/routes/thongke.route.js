var express = require('express');
var router = express.Router();
const { isAuth } = require('../middleware/auth.middleware');

const thongkeController = require('../controllers/thongke.controller');

router.get('/', thongkeController.get_thongkes);
router.get('/my_orders', isAuth, thongkeController.get_thongkes_my_orders);

module.exports = router;