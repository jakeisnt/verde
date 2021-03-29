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

/* Utility functions for the Rooms class. */
function initUser(userId) {
  return { userId, numConnections: 1 };
}

function getUserIds(users) {
  return users.map(({ userId }) => userId);
}

function removeUser(users, userId) {
  return users.filter(({ userId: id }) => id !== userId);
}

function matchUserId(id) {
  return ({ userId }) => userId === id;
}

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
    const room = {
      name,
      users: [],
      inactives: [userId],
    };
    this.rooms[name] = room;
    return room;
  }

  getRoom(name) {
    return name in this.rooms ? this.rooms[name] : null;
  }

  joinRoom(name, userId) {
    console.log(`${userId} is joining room ${name}`);
    const user = users.getUser(userId);
    if (!user) return null;
    const room = this.getRoom(name);
    if (!room) return null;

    const activeIndex = room.users.findIndex(matchUserId(userId));
    if (activeIndex >= 0) {
      // If user is active, increment connection count
      room.users[activeIndex].numConnections += 1;
    } else {
      // If user was not active, add it to the room
      room.users.push(initUser(userId));
      const inactiveIndex = room.inactives.indexOf(userId);
      if (inactiveIndex >= 0) {
        // Remove user from inactives if necessary
        room.inactives.splice(inactiveIndex, 1);
      }
    }

    return room;
  }

  leaveRoom(name, userId) {
    const user = users.getUser(userId);
    if (!user) return null;
    const room = this.getRoom(name);
    if (!room) return null;

    const activeIndex = room.users.findIndex(matchUserId(userId));
    if (activeIndex >= 0) {
      room.users[activeIndex].numConnections -= 1;
      if (room.users[activeIndex].numConnections == 0) {
        // If user is active, make them inactive
        room.users.splice(activeIndex, 1);
        room.inactives.push(userId);
      }
    }

    return room;
  }

  getUsers(name) {
    const room = this.getRoom(name);
    if (!room) return null;
    return {
      users: room.users.map(({ userId }) => users.getUser(userId)),
      inactives: room.inactives.map((userId) => users.getUser(userId)),
    };
  }
}

const rooms = new Rooms();

module.exports = rooms;
