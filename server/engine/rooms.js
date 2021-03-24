/** Bijective hash on 32-bit ints */
function hash(x) {
  let h = x;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h = (h >> 16) ^ h;
  return h;
}

const Websocket = require("ws");

class Rooms {
  constructor(len = 4) {
    this.len = len;
    this.count = Math.floor(Math.random() * 9001) | 0;
    this.rooms = {};
  }

  nextName() {
    let h = hash(this.count);
    const name = [];
    for (let i = 0; i < this.len; i += 1) {
      name.push(String.fromCharCode("A".charCodeAt(0) + (h % 26)));
      h /= 26;
    }
    this.count += 1;
    return name.join("");
  }

  createRoom(username) {
    const name = this.nextName();
    const room = { name, creator: username, users: [username] };
    this.rooms[name] = room;
    return room;
  }

  addUserToRoom(username, roomname) {
    const room = this.getRoom(roomname);
    if (room) room.users.push(username);
    return room;
  }

  getRoom(name) {
    return name in this.rooms ? this.rooms[name] : null;
  }
}

const rooms = new Rooms();

module.exports = rooms;
