const validator = require('validator');

const URL = require('../models/URL');
const UrlPage = require('../models/UrlPage');
const ErrorResponse = require('../utils/errorResponse');

exports.home = (req, res) => {
  res.render('home', { title: 'Home' });
};

exports.checkShortenBody = (req, res, next) => {
  if (!req.body?.url) {
    req.flash('error', 'You need to provide a URL(s)');
    return res.status(400).render('home', { flashes: req.flash() });
  }
  const urls = req.body.url.split(',').map((url) => url.trim());
  const errors = urls.map((url) =>
    validator.isURL(url.trim(), { require_protocol: true })
  );
  if (!errors.every(Boolean)) {
    req.flash('error', 'One of the URL(s) is not valid');
    return res
      .status(400)
      .render('home', { flashes: req.flash(), urls: req.body.url });
  }
  req.body.url = urls;
  next();
};

exports.shorten = async (req, res) => {
  const createPromise = req.body.url.map((url) => URL.create({ url }));
  const urlIds = await Promise.all(createPromise);
  const urlsPage = await UrlPage.create({
    urlIds: urlIds.map((id) => id._id),
  });
  req.flash('success', 'Link(s) have been shortened!');
  res.status(201).redirect(`/links/${urlsPage.id}`);
};

exports.urlsPage = async (req, res, next) => {
  const shorturls = await UrlPage.findOne({ id: req.params.token }).populate(
    'urlIds'
  );
  if (!shorturls) {
    return next(
      new ErrorResponse(
        "Requested links page either expired or doesn't exist.",
        404
      )
    );
  }
  const { urlIds } = shorturls;
  res.render('links', { title: 'Links', urlIds });
};

// Redirecting from the shortened link
exports.redirectPage = async (req, res, next) => {
  const originalURL = await URL.findOne({ urlId: req.params.id });
  if (!originalURL) {
    return next(
      new ErrorResponse("Requested shortened link doesn't exist.", 404)
    );
  }
  res.redirect(originalURL.url);
};

exports.notFavicon = (req, res, next) => {
  // skip the request if favicon
  if (req.params.id == 'favicon.ico') return;
  next();
};
