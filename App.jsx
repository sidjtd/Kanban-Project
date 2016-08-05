'use strict';
import { Link } from 'react-router';import React from 'react';
import BigKanban from './public/js/components/BigKanban.jsx';
import PostColumns from './public/js/components/PostColumns.jsx';
import PostItems from './public/js/components/PostItems.jsx';

class App extends React.Component {
  render() {
    return (
      <div>
        <BigKanban />
      </div>
    )
  }
}

export default App;
