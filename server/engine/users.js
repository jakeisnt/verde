class Users {
  constructor() {
    this.count = 0;
    this.users = {};
  }

  createUser() {
    const id = `${this.count}`;
    const user = { id: id, name: "user" + id };
    this.count++;
    this.users[id] = user;
    return user;
  }

  getUser(id) {
    return id in this.users ? this.users[id] : null;
  }

  setName(id, name) {
    if (id in this.users) {
      this.users[id].name = name;
      return this.users[id];
    }
    return null;
  }
}

const users = new Users();

module.exports = users;
