import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter as Router,
  Route,
} from 'react-router-dom';

class App extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <Router>
        <Route path="/" component={Home}/>
        <Route path="/user" component={User}/>
        <Route path="/profile" component={Profile}/>
      </Router>
    );
  } 
}  



ReactDOM.render(
  <App/>,
  document.getElementById('root')
);