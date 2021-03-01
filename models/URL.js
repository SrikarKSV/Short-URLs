const mongoose = require('mongoose');
const crypto = require('crypto');

const urlSchema = new mongoose.Schema({
  url: {
    type: String,
    trim: true,
    required: 'You need to provide a URL',
  },
  urlId: String,
});

urlSchema.pre('save', function (next) {
  this.urlId = crypto.randomBytes(4).toString('hex');
  next();
});

const urlModel = mongoose.model('URLs', urlSchema);

module.exports = urlModel;
