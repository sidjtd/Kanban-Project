import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory} from 'react-router';
import App from './App.jsx';
import About from './public/static/About.jsx';
import NoMatch from './public/static/NoMatch.jsx';
import './scss/styles.scss';
/*=====================================================
=            This is cool REDUX STUFF!!!!!            =
=====================================================*/
import { Provider } from 'react-redux';

import * as fromReducers from './reducers';
const reducer = combineReducers(fromReducers);
const store = createStore(reducer);

import { createStore, combineReducers } from 'redux';
// console.log('ENTRY,store.getState():',store.getState());
/*=====  End of This is cool REDUX STUFF!!!!!  ======*/
ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path='/' component={App}/>
      <Route path='/about' component={About}/>
      <Route path='*' component={NoMatch}/>
    </Router>
  </Provider>,
  document.getElementById('content')
);