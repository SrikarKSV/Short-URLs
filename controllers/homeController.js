const URL = require('../models/URL');

exports.home = (req, res) => {
  let shorturl;
  if (req.body?.shorturl) {
    shorturl = `${req.headers.host}/${req.body.shorturl}`;
  }
  res.render('home', { title: 'Home', shorturl });
};

exports.shorten = async (req, res, next) => {
  const shortenedURL = await URL.create(req.body);
  req.body.shorturl = shortenedURL.urlId;
  next();
};

exports.redirectPage = async (req, res) => {
  const originalURL = await URL.findOne({ urlId: req.params.id });
  res.redirect(originalURL.url);
};
