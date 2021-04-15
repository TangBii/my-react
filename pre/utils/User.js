const User = {
  list() {
    const userStr = sessionStorage.getItem('users');
    return userStr ? JSON.parse(userStr) : [];
  },
  add(username) {
    const users = User.list();
    users.push({ id: Date.now(), name: username });
    sessionStorage.setItem('users', JSON.stringify(users));
  },
  find(id) {
    const users = User.list();
    for (const user of users) {
      if (`${user.id}` === id) {
        return user;
      }
    }
    return null;
  },
};

export default User;
