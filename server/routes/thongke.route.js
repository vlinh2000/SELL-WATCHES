var express = require('express');
var router = express.Router();

const thongkeController = require('../controllers/thongke.controller');

router.get('/', thongkeController.get_thongkes);

module.exports = router;