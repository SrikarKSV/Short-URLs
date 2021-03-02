const URL = require('../models/URL');
const UrlPage = require('../models/UrlPage');

exports.home = (req, res) => {
  res.render('home', { title: 'Home' });
};

exports.shorten = async (req, res) => {
  const createPromise = req.body.url
    .split(',')
    .map((url) => URL.create({ url: url.trim() }));
  const urlIds = await Promise.all(createPromise);
  const urlsPage = await UrlPage.create({
    urlIds: urlIds.map((id) => id._id),
  });
  req.flash('success', 'Link(s) have been shortened!');
  res.status(201).redirect(`/links/${urlsPage.id}`);
};

exports.urlsPage = async (req, res) => {
  const shorturls = await UrlPage.findOne({ id: req.params.token }).populate(
    'urlIds'
  );
  console.log(shorturls);
  const { urlIds } = shorturls;
  res.render('links', { title: 'Links', urlIds });
};

// Redirecting from the shortened link
exports.redirectPage = async (req, res) => {
  const originalURL = await URL.findOne({ urlId: req.params.id });
  res.redirect(originalURL.url);
};

exports.notFavicon = (req, res, next) => {
  // skip the request if favicon
  if (req.params.id == 'favicon.ico') return;
  next();
};
