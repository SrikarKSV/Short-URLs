const validator = require('validator');

const URL = require('../models/URL');
const UrlPage = require('../models/UrlPage');
const ErrorResponse = require('../utils/errorResponse');

exports.home = (req, res) => {
  res.render('home');
};

exports.checkShortenBody = (req, res, next) => {
  if (!req.body?.url && !req.body?.expiryDate) {
    req.flash('error', 'You need to provide a URL(s) and expiry date!');
    return res.status(400).render('home', { flashes: req.flash() });
  }
  const { url, expiryDate } = req.body;
  const urls = url.split(',').map((url) => url.trim());
  const urlErrors = urls.map((url) =>
    validator.isURL(url.trim(), { require_protocol: true })
  );
  // Checking if expiry date is permanent or temp
  // If temp it is checked if the expiry date is in the future or not
  const expiryError =
    expiryDate === 'permanent' ||
    (validator.isDate(new Date(expiryDate)) &&
      !new Date(expiryDate) < Date.now());
  if (!urlErrors.every(Boolean) || !expiryError) {
    req.flash(
      'error',
      'One of the URL(s) or expiry date is not valid (make sure to add protocols to each URL)'
    );
    return res.status(400).render('home', { flashes: req.flash(), urls: url });
  }
  if (expiryDate === 'permanent') req.body.expiryDate = null;
  req.body.url = urls;
  next();
};

exports.shorten = async (req, res) => {
  let { url, expiryDate } = req.body;
  const createPromise = url.map((url) => URL.create({ url, expiryDate }));
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
  urlIds.forEach(
    (urlId) => (urlId.urlId = `http://localhost:4000/${urlId.urlId}`)
  );
  res.render('links', { title: 'Links', urlIds });
};

// Redirecting from the shortened link
exports.redirectPage = async (req, res, next) => {
  const originalURL = await URL.findOne({ urlId: req.params.id });
  const error = new ErrorResponse(
    "Requested shortened link doesn't exist or expired.",
    404
  );
  if (!originalURL) {
    return next(error);
  }
  const { url, expiryDate } = originalURL;
  // Redirect directly if permanent
  if (expiryDate === null) return res.redirect(url);
  // Check if link valid
  if (Date.now() < new Date(expiryDate).getTime()) return res.redirect(url);
  else {
    // Drop the document if not valid
    originalURL.remove();
    next(error);
  }
};

exports.notFavicon = (req, res, next) => {
  // skip the request if favicon
  if (req.params.id == 'favicon.ico') return;
  next();
};
