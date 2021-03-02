const express = require('express');
const homeController = require('../controllers/homeController');

const router = express.Router();

router.route('/').get(homeController.home).post(homeController.shorten);

router.get('/links/:token', homeController.urlsPage);

router.get('/:id', homeController.notFavicon, homeController.redirectPage);

module.exports = router;
