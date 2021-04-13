import React from 'react';
import { Switch, Redirect, Route, NavLink } from '../lib/react-router-dom';


import UserList from './UserList';
import UserAdd from './UserAdd';
import UserDetail from './UserDetail';

export default class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <ul>
          <li><NavLink to="/user/userlist">用户列表</NavLink></li>
          <li><NavLink to="/user/useradd">添加用户</NavLink></li>
          <li><NavLink to="/user/userdetail">用户详情</NavLink></li>
        </ul>
        <Switch>
          <Route path="/user/userlist" component={UserList} />
          <Route path="/user/useradd" component={UserAdd} />
          <Route path="/user/userdetail/:id" component={UserDetail} />
          <Redirect to="/user/userlist" />
        </Switch>
      </>
    );
  }
}
