'use strict';
const express = require('express');
const Router = express.Router();
const Card = require('../public/js/models/CardSchema');
const bodyParser = require('body-parser');
/*==============================
=            Routes            =
==============================*/
Router.get('/getAll', function(req, res) {
  Card.find({})
    .then((dataSomething) => {
      // console.log(dataSomething)
      res.send(dataSomething)
    })
    .catch((err) => {
      console.log('this is the error' + err)
    });
});

function seeder(howMany) {
  var card;
  var letters = ['a','q','x','b','r','y','c','s','z'];
  var stat = [1,2,3,1,2,3,1,2,3];
  for (var i = 0; i < howMany; i++){
    card = new Card({ "title" : letters[i]+" Task", "description" : "some desc", "priority" : "URGENT", "status" : stat[i], "createdBy" : "DevLeague", "assignedTo" : "Tyler"});
    card.save();
  }
};

Router.put('/update', function(req, res) {
  Card.update({ _id: req.body.id},
     { $set: {status: req.body.stat}}, () => {
    res.json({message: 'PUTPUT!'});
   });
});

Router.put('/lefter', function(req, res) {
  Card.update({ _id: req.body.id},
     { $inc: {status: -1}}, () => {
    res.json({});
   });
});

Router.put('/righter', function(req, res) {
  Card.update({ _id: req.body.id},
     { $inc: {status: 1}}, () => {
    res.json({});
   });
});

Router.delete('/delete', function(req, res) {
  Card.remove({_id: req.body.id}, () => {
  res.json({message: 'Deleted!'});
  });
});

Router.post('/seed', (req, res) => {
　seeder(req.body.num);
  res.json({message: 'Seeded!'});
});

Router.post('/addACard', (req, res) => {
  var rq = req.body;
  var card = new Card({
    "title" : rq.title,
    "description" : rq.desc,
    "priority": rq.priority,
    "status": rq.status,
    "createdBy": rq.author,
    "assignedTo": rq.handler
  });
  card.save(function(err) {
  });
    res.send();
});

var removeAll = function(db, cb) {
  Card.find({ _id: { $exists: true}}).remove(cb);
};

Router.delete('/removeall', function(req, res) {
  removeAll(db, function(req, res) {
    Card.find({})
      .then((dataSomething) => {
        console.log(dataSomething)
      })
      .catch((err) => {
        console.log('this is the error' + err)
      });
  });
  res.json({message: 'All Deleted!'});
});

module.exports = Router;