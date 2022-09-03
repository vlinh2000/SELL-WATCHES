var express = require('express');
var router = express.Router();

const nhacungcapController = require('../controllers/nhacungcap.controller');

router.get('/', nhacungcapController.get_nhacungcaps);
router.get('/:nhacungcapID', nhacungcapController.get_nhacungcap);
router.post('/', nhacungcapController.post_nhacungcaps);
router.patch('/:nhacungcapID', nhacungcapController.patch_nhacungcaps);
router.delete('/:nhacungcapID', nhacungcapController.delete_nhacungcaps);

module.exports = router;