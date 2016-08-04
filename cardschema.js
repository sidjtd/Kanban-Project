const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');
/*================================
=            Schema's            =
================================*/
const Card = mongoose.model('Card', {
  title: String,
  description: String,
  priority: String,
  status : Number,
  createdBy: String,
  assignedTo: String,
  date: {type: Date, default: Date.now}
});
/*=====  End of CardSchema  ======*/
module.exports = mongoose.model('Card', Card);
