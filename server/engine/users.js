/** Bijective hash on 32-bit ints */
function hash(x) {
  let h = x;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h = (h >> 16) ^ h;
  return h;
}

const idLen = 9;

class Users {
  constructor() {
    this.count = Math.floor(Math.random() * 9001) | 0;
    this.users = {};
  }

  nextId() {
    let h = hash(this.count);
    const id = [];
    for (let i = 0; i < idLen; i += 1) {
      id.push(`${h % 10}`);
      h = (h / 10) | 0;
    }
    this.count += 1;
    return id.join("");
  }

  createUser() {
    const id = this.nextId();
    const user = { id, name: `user${id}` };
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
