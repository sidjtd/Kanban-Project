'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*================================
=            Schema's            =
================================*/

const CardSchema = new Schema({
  id: Number,
  title: String,
  description: String,
  priority: String,
  status : String,
  createdBy: String,
  assignedTo: String,
  date: {type: Date, default: Date.now}
});


/*=====  End of CardSchema  ======*/
module.exports = mongoose.model('CardSchema', CardSchema);
