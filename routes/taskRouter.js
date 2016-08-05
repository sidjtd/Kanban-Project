'use strict';
const express = require('express');
const eRouter = express.Router();
const Card = require('./../public/js/models/CardSchema');
const mongoose = require('mongoose');
const db = mongoose.connection;
/*==============================
=            Routes            =
==============================*/
eRouter.get('/getAll', function(req, res) {
  Card.find({}, function (err, tasks) {
    console.log("We entered here",err,tasks);
    if(err) {return res.send(err)}
    return res.send(tasks)
  });
});


eRouter.put('/update', function(req, res) {
  Card.update({ _id: req.body.id},
     { $set: {status: req.body.stat}}, () => {
    res.json({message: 'PUTPUT!'});
   });
});

eRouter.put('/lefter', function(req, res) {
  Card.update({ _id: req.body.id},
     { $inc: {status: -1}}, () => {
    res.json({});
   });
});

eRouter.put('/righter', function(req, res) {
  Card.update({ _id: req.body.id},
     { $inc: {status: 1}}, () => {
    res.json({});
   });
});

eRouter.delete('/delete', function(req, res) {
  Card.remove({_id: req.body.id}, () => {
  res.json({message: 'Deleted!'});
  });
});

function seeder(howMany) {
  var newNum = howMany;
  newNum = 6;
  var card;
  var letters = ['a','q','x','b','r','y','c','s','z'];
  var stat = [1,2,3,1,2,3,1,2,3];
  for (var i = 0; i < newNum; i++){
    card = new Card({ "title" : letters[i]+" Task", "description" : "some desc", "priority" : "URGENT", "status" : stat[i], "createdBy" : "DevLeague", "assignedTo" : "Tyler"});
    card.save();
  }
};

eRouter.post('/seed', (req, res) => {
  console.log("seeded");
　seeder(3);
  res.json({message: 'Seeded!'});
});

eRouter.post('/addACard', (req, res) => {
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

eRouter.delete('/removeall', function(req, res) {
  removeAll(db, function(req, res) {
    Card.find({})
      .then((dataSomething) => {
      })
      .catch((err) => {
        console.log('this is the error' + err)
      });
  });
  res.json({message: 'All Deleted!'});
});

module.exports = eRouter;