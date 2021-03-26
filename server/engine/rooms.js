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
      users: [initUser(userId)],
      inactives: [],
    };
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
    if (room) {
      // If the user isn't in the list of active users:
      if (!getUserIds(room.users).includes(userId)) {
        // Add the user to the active users
        room.users.push(initUser(userId));
        // Remove the user from the inactive users, if they're present
        room.inactives = removeUser(room.inactives, userId);
      }

      // If the user is currently an active user,
      else {
        // Increment the number of connections they have
        room.users.forEach((user) => {
          if (user.userId === userId) user.numConnections += 1;
        });
      }
    }
    return room;
  }

  leaveRoom(name, userId) {
    const user = users.getUser(userId);
    if (!user) return null;
    const room = this.getRoom(name);
    // If the room has the current user,
    if (room && getUserIds(room.users).includes(userId)) {
      // Move them to the list of inactive users
      room.users = removeUser(room.users, userId);
      room.inactives.push({ userId });
    }
    return room;
  }

  getUsers(name) {
    const room = this.getRoom(name);
    if (!room) return null;
    return room.users.map(({ userId }) => users.getUser(userId));
  }
}

const rooms = new Rooms();

module.exports = rooms;
