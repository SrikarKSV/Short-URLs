const express = require('express');
const homeController = require('../controllers/homeController');

const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

router
  .route('/')
  .get(homeController.home)
  .post(homeController.checkShortenBody, catchErrors(homeController.shorten));

router.get('/links/:token', catchErrors(homeController.urlsPage));

router.get(
  '/:id',
  homeController.notFavicon,
  catchErrors(homeController.redirectPage)
);

module.exports = router;
