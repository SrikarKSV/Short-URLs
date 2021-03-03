const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');

const urlSchema = new mongoose.Schema({
  url: {
    type: String,
    trim: true,
    required: 'You need to provide a URL(s)',
    validate: [validator.isURL, 'One of the URL(s) is not valid'],
  },
  expiryDate: Date,
  urlId: String,
});

urlSchema.pre('save', function (next) {
  this.urlId = crypto.randomBytes(4).toString('hex');
  next();
});

const urlModel = mongoose.model('URL', urlSchema);

module.exports = urlModel;
