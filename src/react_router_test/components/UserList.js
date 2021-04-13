import React from 'react';
import { NavLink } from '../lib/react-router-dom';

import User from '../utils/User';


export default class UserList extends React.Component {
  render() {
    return (
      <ul>
        {
          User.list().map(
            user =>
              (
                <li key={user.id}>
                  <NavLink to={{ pathname: `/user/userdetail/${user.id}`, state: user }}>
                    {user.name}
                  </NavLink>
                </li>
              ),
          )
        }
      </ul>
    );
  }
}
