import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Switch,
  Redirect,
} from './lib/react-router-dom';

import Home from './components/Home';
import User from './components/User';
import Profile from './components/Profile';
import Login from './components/Login';
import NavHeader from './components/NavHeader';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <Router>
          <NavHeader />
          <ul>
            <li><NavLink to="/" exact>Home</NavLink></li>
            <li><NavLink to={{ pathname: '/user', state: null }}>User</NavLink></li>
            <li><NavLink to="/profile">Profile</NavLink></li>
            <li><NavLink to="/login">Login</NavLink></li>

          </ul>
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/user" component={User} />
            <Route path="/profile" component={Profile} />
            <Route path="/login" component={Login} />
            <Redirect to="/" />
          </Switch>
        </Router>
      </>
    );
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
