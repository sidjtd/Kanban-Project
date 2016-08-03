'use strict'
/*=====================================
=            DevDependencies          =
=====================================*/
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const gulp = require('gulp');
const router = express.Router();

/*================================
=            Mongoose            =
================================*/
const mongoose = require('mongoose');
      mongoose.connect('mongodb://localhost/Kanban');
      mongoose.Promise = require('bluebird');
const db = mongoose.connection;
// console.log(db);
// const CardSchema = require('./public/js/models/CardSchema');
const Card = mongoose.model('Card', {
  title: String,
  description: String,
  priority: String,
  status : String,
  createdBy: String,
  assignedTo: String,
  date: {type: Date, default: Date.now}
});

db.on('error',  console.error.bind(console, 'connection error:'));
db.once('open', () => {
 console.log('db.once');
});

/*==================================
=            Middleware            =
==================================*/
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Testing Route
app.use('/test', router);
router.get('/', function(req, res) {
  res.json({ message: 'Test route success!'  });
});


/*==============================
=            Routes            =
==============================*/
function seeder(howMany) {
  var card;
  var letters = ['a','q','x','b','r','y','c','s','z'];
  var stat = ['todo','doing','done','todo','doing','done','todo','doing','done'];
  for (var i = 0; i < howMany; i++){
    card = new Card({ "title" : letters[i]+"title", "description" : "some desc", "priority" : "red alert", "status" : stat[i], "createdBy" : "bob", "assignedTo" : "tyler"});
    card.save();
  }
};

app.get('/getAll', function(req, res) {
  Card.find({})
    .then((dataSomething) => {
      console.log(dataSomething)
      res.send(dataSomething)
    })
    .catch((err) => {
      console.log('this is the error' + err)
    });
});

app.post('/testpost', (req, res) => {
  var card = new Card({ "title" : "fresh", "description" : "minty", "priority" : "lax", "status" : "todo", "createdBy" : "xin", "assignedTo" : "tyler"});
  card.save();
  res.send({test:"testing!!"});
});

app.post('/addACard', (req, res) => {
  var rq = req.body;
  var card = new Card({
    "title" : rq.title,
    "description" : rq.desc,
    "priority": rq.priority,
    "status": rq.status,
    "createdBy": rq.author,
    "assignedTo": rq.handler
  });
  card.save();
  res.send({test:"Added!"});
});

app.post('/seed', (req, res) => {
  console.log(req.body);
　seeder(req.body.num);
  res.json({message: 'Seeded!'});
});

app.put('/update', function(req, res) {
  Card.update({ _id: req.body.id},
     {$set: {status: req.body.stat}}, () => {
    res.json({message: 'PUTPUT!'});
   });
});

app.delete('/delete', function(req, res) {
  Card.remove({_id: req.body.id}, () => {
  res.json({message: 'Deleted!'});
  });
});
/*==============================
=          Test Routes         =
==============================*/

var removeAll = function(db, cb) {
  Card.find({ _id: { $exists: true}}).remove(cb);
};
app.delete('/removeall', function(req, res) {
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



app.get('/testing', function (req, res) {
  Card.find({}, (err, docs) => {
      res.json(docs);
  });
});


/*======================================
=            Listener            =
======================================*/
const PORT = 2459;
app.listen(PORT, (req, res) => {
  console.log('app.listen');
});