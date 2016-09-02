'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Bear = new Schema({
  name: String,
  creator: String,
  dateCreated: Date,
  posX: Number,
  posY: Number
}, {
  timestamps: true
});

module.exports = mongoose.model('Bear', Bear);
