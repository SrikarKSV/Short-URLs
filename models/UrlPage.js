const mongoose = require('mongoose');
const crypto = require('crypto');

const urlPageSchema = new mongoose.Schema({
  id: String,
  urlIds: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'URL',
    },
  ],
  createdAt: {
    type: Date,
    expires: '24h',
    default: Date.now,
  },
});

urlPageSchema.pre('save', function (next) {
  this.id = crypto.randomBytes(5).toString('hex');
  next();
});

const urlPageModel = mongoose.model('Links', urlPageSchema);

module.exports = urlPageModel;
