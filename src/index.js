import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter as Router,
  Route,
} from './lib/react-router-dom';

import Home from './components/Home';
import User from './components/User';
import Profile from './components/Profile';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Router>
        <Route path="/" component={Home} exact />
        <Route path="/user" component={User} />
        <Route path="/profile" component={Profile} />
      </Router>
    );
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
