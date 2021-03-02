const URL = require('../models/URL');

exports.home = (req, res) => {
  let shorturl;
  if (req.body?.shorturl) {
    shorturl = req.body.shorturl.map((url) => ({
      originalURL: url.url,
      short: `${req.headers.host}/${url.urlId}`,
    }));
  }
  res.render('home', { title: 'Home', shorturl });
};

exports.shorten = async (req, res, next) => {
  const createPromise = req.body.url
    .split(',')
    .map((url) => URL.create({ url: url.trim() }));
  const urlIds = await Promise.all(createPromise);
  req.body.shorturl = urlIds;
  next();
};

exports.notFavicon = (req, res, next) => {
  // skip the request if favicon
  if (req.params.id == 'favicon.ico') return;
  next();
};

exports.redirectPage = async (req, res) => {
  const originalURL = await URL.findOne({ urlId: req.params.id });
  res.redirect(originalURL.url);
};
