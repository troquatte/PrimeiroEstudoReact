import React, { Component } from 'react';

import Routes from './router';
import GlobalStyle from './styles/global'

class App extends Component {
  render() {
    return (
      <>
        <Routes />
        <GlobalStyle />
      </>
    );
  }
}

export default App;
