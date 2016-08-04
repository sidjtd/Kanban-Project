'use strict';
const gulp = require('gulp');
var webpackStream = require('webpack-stream');
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const router = express.Router();
const app = express();
const fs = require('fs');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.js');
/*================================
=            Mongoose            =
================================*/
const mongoose = require('mongoose');
      mongoose.connect('mongodb://localhost/Kanban');
      mongoose.Promise = require('bluebird');
const db = mongoose.connection;
const Card = require('./public/js/models/CardSchema');

db.on('error',  console.error.bind(console, 'connection error:'));
db.once('open', () => {
 console.log('db.once');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
/*==============================
=            Routes            =
==============================*/
app.get('/getAll', function(req, res) {
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

app.put('/update', function(req, res) {
  Card.update({ _id: req.body.id},
     { $set: {status: req.body.stat}}, () => {
    res.json({message: 'PUTPUT!'});
   });
});

app.put('/lefter', function(req, res) {
  Card.update({ _id: req.body.id},
     { $inc: {status: -1}}, () => {
    res.json({});
   });
});
app.put('/righter', function(req, res) {
  Card.update({ _id: req.body.id},
     { $inc: {status: 1}}, () => {
    res.json({});
   });
});

app.delete('/delete', function(req, res) {
  Card.remove({_id: req.body.id}, () => {
  res.json({message: 'Deleted!'});
  });
});


app.post('/seed', (req, res) => {
  // console.log(req.body);
　seeder(req.body.num);
  res.json({message: 'Seeded!'});
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
  card.save(function(err) {
  });
    res.send();
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



const onStart = (err) => {
  if (err) {
    throw new Error(err);
  }
  console.info(
    `==> 🌎 Listening on port ${port}. ` +
    `Open up http://localhost:${port}/ in your browser.`
  );
};
// Check to see what dev environment we are in
const isDeveloping = true;
const port = isDeveloping ? 3000 : process.env.PORT;

if (isDeveloping) {
  app.set('host', 'http://localhost');
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false,
    },
  });
  const response = (req, res) => {
    res.write(middleware.fileSystem.readFileSync(path.resolve(__dirname, 'dist/index.html')));
    res.end();
  };
  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('*', response);
} else {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(express.static(`${__dirname}/dist`));
  app.get('*', (req, res) => {
    res.write(
      fs.readFileSync(path.resolve(__dirname, 'dist/index.html'))
    );
  });
}
/*======================================
=            Listener            =
======================================*/
const PORT = 3000;
app.listen(PORT, (req, res) => {
  console.log('app.listen');
});