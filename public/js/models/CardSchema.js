'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*================================
=            Schema's            =
================================*/

const CardSchema = new Schema({
  title: String,
  description: String,
  priority: String,
  status : Number,
  createdBy: String,
  assignedTo: String,
  date: {type: Date, default: Date.now}
});

/*=====  End of CardSchema  ======*/
module.exports = mongoose.model('Card', CardSchema);
