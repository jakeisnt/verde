const users = require("./users");

/** Bijective hash on 32-bit ints */
function hash(x) {
  let h = x;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h = (h >> 16) ^ h;
  return h;
}

class Rooms {
  constructor(len = 4) {
    this.len = len;
    this.count = Math.floor(Math.random() * 9001) | 0;
    this.rooms = {};
  }

  nextName() {
    let h = hash(this.count);
    const name = [];
    for (let i = 0; i < this.len; i++) {
      name.push(String.fromCharCode("A".charCodeAt(0) + (h % 26)));
      h /= 26;
    }
    this.count++;
    return name.join("");
  }

  createRoom(userId) {
    const user = users.getUser(userId);
    if (!user) return null;
    const name = this.nextName();
    const room = { name: name, creator: user, users: { userId: user } };
    this.rooms[name] = room;
    return room;
  }

  addUserToRoom(name, userId) {
    const user = users.getUser(userId);
    if (!user) return null;
    const room = this.getRoom(name);
    if (room) room.users[userId] = user;
    return room;
  }

  getRoom(name) {
    return name in this.rooms ? this.rooms[name] : null;
  }
}

const rooms = new Rooms();

module.exports = rooms;
