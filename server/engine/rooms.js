const users = require("./users");

/** Bijective hash on 32-bit ints */
function hash(x) {
  let h = x;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h = (h >> 16) ^ h;
  return h;
}

const nameLen = 4;

class Rooms {
  constructor() {
    this.count = Math.floor(Math.random() * 9001) | 0;
    this.rooms = {};
  }

  nextName() {
    let h = hash(this.count);
    const name = [];
    for (let i = 0; i < nameLen; i += 1) {
      name.push(String.fromCharCode("A".charCodeAt(0) + (h % 26)));
      h = (h / 26) | 0;
    }
    this.count += 1;
    return name.join("");
  }

  createRoom(userId) {
    const user = users.getUser(userId);
    if (!user) return null;
    const name = this.nextName();
    const room = { name: name, users: [userId] };
    this.rooms[name] = room;
    return room;
  }

  getRoom(name) {
    return name in this.rooms ? this.rooms[name] : null;
  }

  joinRoom(name, userId) {
    const user = users.getUser(userId);
    if (!user) return null;
    const room = this.getRoom(name);
    if (room && !room.users.includes(userId)) {
      room.users.push(userId);
    }
    return room;
  }

  getUsers(name) {
    const room = this.getRoom(name);
    if (!room) return null;
    return room.users.map((userId) => users.getUser(userId));
  }
}

const rooms = new Rooms();

module.exports = rooms;
