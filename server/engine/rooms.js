const users = require("./users");
const assert = require("assert");

/** Bijective hash on 32-bit ints */
function hash(x) {
  let h = x;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h = (h >> 16) ^ h;
  return h;
}

const nameLen = 4;

const UserStatus = {
  INACTIVE: 0,
  ACTIVE: 1,
  SPECTATING: 2,
};

function matchUserId(id) {
  return ({ userId }) => userId === id;
}

class Room {
  constructor(name, capacity = -1) {
    this.name = name;
    this.capacity = capacity;
    this.locked = false;
    this.numActive = 0;
    this.users = [];
  }

  canJoinActive() {
    if (this.locked) return false;
    return this.capacity < 0 || this.numActive < this.capacity;
  }

  join(userId) {
    users.getUser(userId);

    const index = this.users.findIndex(matchUserId(userId));
    if (index >= 0 && this.users[index].status !== UserStatus.INACTIVE) {
      // If user is not inactive, just increase its connection count
      this.users[index].count += 1;
    } else {
      // If user is inactive or not present, move or push it to the back
      if (index >= 0) {
        this.users.splice(index, 1);
      }
      if (this.canJoinActive()) {
        this.users.push({ userId, count: 1, status: UserStatus.ACTIVE });
      } else {
        this.users.push({ userId, count: 1, status: UserStatus.SPECTATING });
      }
      this.numActive += 1;
    }
  }

  setStatus(userId, spectate) {
    users.getUser(userId);

    const index = this.users.findIndex(matchUserId(userId));
    if (index < 0) {
      throw new Error(`user ${userId} not in room ${this.name}`);
    }
    if (this.users[index].status === UserStatus.INACTIVE) {
      throw new Error(`user ${userId} inactive in room ${this.name}`);
    }
    if (spectate) {
      this.users[index].status = UserStatus.SPECTATING;
    } else if (this.canJoinActive()) {
      this.users[index].status = UserStatus.ACTIVE;
      this.users.push(this.users.splice(index, 1)[0]);
    }
  }

  leave(userId) {
    users.getUser(userId);

    const index = this.users.findIndex(matchUserId(userId));
    if (index >= 0) {
      if (this.users[index].status === UserStatus.INACTIVE) {
        throw new Error(`inactive user ${userId} leaving room ${this.name}`);
      }
      assert(this.users[index].count > 0); // Can't happen even with bad call
      this.users[index].count -= 1;
      if (this.users[index].count === 0) {
        // User actually leaves room when connection count drops to zero
        if (this.users[index].status === UserStatus.ACTIVE) {
          this.numActive -= 1;
        }
        this.users[index].status = UserStatus.INACTIVE;
      }
    } else {
      throw new Error(`user ${userId} not in room ${this.name}`);
    }
  }

  getUsers() {
    const userLists = {
      actives: [],
      inactives: [],
      spectators: [],
    };
    this.users.forEach(({ userId, status }) => {
      try {
        const user = users.getUser(userId);
        switch (status) {
          case UserStatus.ACTIVE:
            userLists.actives.push(user);
            break;
          case UserStatus.INACTIVE:
            userLists.inactives.push(user);
            break;
          case UserStatus.SPECTATING:
            userLists.spectators.push(user);
            break;
        }
      } catch (error) {
        console.error(`could not retrieve user ${userId}: ${error.message}`);
      }
    });
    return userLists;
  }
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

  createRoom(userId, capacity = -1) {
    users.getUser(userId);
    const name = this.nextName();
    const room = new Room(name, capacity);
    this.rooms[name] = room;
    return room;
  }

  getRoom(name) {
    if (name in this.rooms) return this.rooms[name];
    throw new Error(`room ${name} does not exist`);
  }

  joinRoom(name, userId) {
    this.getRoom(name).join(userId);
  }

  setStatus(name, userId, spectate) {
    this.getRoom(name).setStatus(userId, spectate);
  }

  leaveRoom(name, userId) {
    this.getRoom(name).leave(userId);
  }

  getUsers(name) {
    return this.getRoom(name).getUsers();
  }
}

const rooms = new Rooms();

module.exports = rooms;
