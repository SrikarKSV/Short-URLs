const express = require('express');
const homeController = require('../controllers/homeController');

const router = express.Router();

router.get('/', homeController.home);
router.post('/shorten', homeController.shorten, homeController.home);
router.get('/:id', homeController.redirectPage);

module.exports = router;
