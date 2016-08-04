'use strict';
const gulp = require('gulp');
var webpackStream = require('webpack-stream');
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.js');

const tRouter = require('./routes/taskRouter');
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
app.use('/', tRouter);

/*==================================
=            Connection            =
==================================*/
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