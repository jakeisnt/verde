const Users = require("./users");

/** Bijective hash on 32-bit ints */
function hashInt32(x) {
  let h = x | 0;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h ^= h >> 16;
  return h;
}

const nameLen = 4;

class RoomUser {
  constructor(id) {
    this.id = id;
    this.present = true;
    this.spectate = false;
    this.banned = false;
    this.count = 0;
  }
}

class Room {
  constructor(name, capacity = -1) {
    this.name = name;
    this.capacity = capacity;
    this.users = [];
    this.numPlayers = 0;
    this.locked = true;
  }

  getNumPlayers() {
    return this.getUsers().players.length;
  }

  getUsers() {
    const players = [];
    const inactives = [];
    const bannedUsers = [];
    const spectators = [];
    this.users.forEach(({ id, present, spectate, banned }) => {
      const user = Users.getUser(id);
      if (user) {
        if (banned) bannedUsers.push(user);
        else if (!present) inactives.push(user);
        else if (spectate) spectators.push(user);
        else players.push(user);
      }
    });
    return { players, inactives, spectators, banned: bannedUsers };
  }

  canJoinAsPlayer() {
    if (this.locked) return false;
    return this.capacity < 0 || this.numPlayers < this.capacity;
  }

  getCurrentPlayers() {
    return this.users.filter(({ present, spectate }) => present && !spectate);
  }

  isModerator(userId) {
    // The moderator is the first added active player.
    return this.numPlayers > 0 && userId === this.getCurrentPlayers()[0].id;
  }

  isBanned(userId) {
    return this.getUser(userId)?.banned;
  }

  getUser(userId) {
    const index = this.users.findIndex(({ id }) => id === userId);
    return index >= 0 ? this.users[index] : undefined;
  }

  getOrMakeUser(userId) {
    return this.getUser(userId) || new RoomUser(userId);
  }

  join(userId) {
    // The user can take no actions in this room if they are banned
    if (this.isBanned(userId)) return undefined;

    const index = this.users.findIndex(({ id }) => id === userId);
    const user = index >= 0 ? this.users[index] : new RoomUser(userId);

    if (index >= 0 && !user.present) {
      // Splice user (and later repush) if it was inactive
      this.users.splice(index, 1);
    }
    if (index < 0 || !user.present) {
      // Push (or repush) user if they are new or were inactive
      if (this.canJoinAsPlayer()) {
        if (!user.spectate) this.numPlayers += 1;
      } else {
        user.spectate = true;
      }
      this.users.push(user);
    }
    user.present = true;
    user.count += 1;

    this.promoteSpectator();

    return user;
  }

  promoteSpectator() {
    // if there are no more players, promote a spectator
    if (this.getNumPlayers() === 0) {
      const { players, inactives, spectators, banned } = this.getUsers();
      console.log(players, inactives, spectators, banned, this.users);
      if (spectators.length > 0) {
        const upgradee = spectators[0].id;
        console.log(`Upgrading spectator ${upgradee} to moderator!`);
        this.getUser(upgradee).spectate = false;
        // but if there are no more spectators, close the room
      } else {
        // close the room?
      }
    }
  }

  leave(userId) {
    // The user can take no actions in this room if they are banned
    if (this.isBanned(userId)) return undefined;

    const index = this.users.findIndex(({ id }) => id === userId);
    if (index < 0) return undefined;
    const user = this.users[index];
    if (!user.present) return undefined;

    user.count -= 1;
    if (user.count === 0) {
      if (!user.spectate) this.numPlayers -= 1;
      user.present = false;
    }

    this.promoteSpectator();
    return user;
  }

  ban(bannerId, banneeId) {
    if (!this.isModerator(bannerId)) return undefined;
    const bannedUser = this.users.forEach((user) => {
      /* eslint-disable-next-line no-param-reassign */
      if (user.id === banneeId) user.banned = true;
    });

    return bannedUser;
  }

  setSpectate(userId, spectate) {
    // The user can take no actions in this room if they are banned
    if (this.isBanned(userId)) return undefined;

    const index = this.users.findIndex(({ id }) => id === userId);
    if (index < 0) return undefined;
    const user = this.users[index];
    if (!user.present) return undefined;

    if (spectate) {
      if (!user.spectate) {
        user.spectate = true;
        this.numPlayers -= 1;
        this.promoteSpectator();
      }
    } else if (this.canJoinAsPlayer()) {
      if (user.spectate) {
        user.spectate = false;
        this.users.splice(index, 1);
        this.users.push(user);
        this.numPlayers += 1;
      }
    }

    return user;
  }

  modSetSpectate(modId, userId, spectate) {
    if (!this.isModerator(modId)) return undefined;
    return setSpectate(userId, spectate);
  }
}

class Rooms {
  static count = Math.floor(Math.random() * 9001) | 0;

  static rooms = {};

  static nextName() {
    let h = hashInt32(this.count);
    const name = [];
    for (let i = 0; i < nameLen; i += 1) {
      name.push(String.fromCharCode("A".charCodeAt(0) + (h % 26)));
      h = (h / 26) | 0;
    }
    this.count += 1;
    return name.join("");
  }

  static createRoom(userId, capacity = -1) {
    const name = this.nextName();
    const room = new Room(name, capacity);
    this.rooms[name] = room;
    return room;
  }

  static deleteRoom(name) {
    if (name in this.rooms) delete this.rooms[name];
  }

  static getRoom(name) {
    return this.rooms[name];
  }

  static joinRoom(name, userId) {
    return this.getRoom(name)?.join(userId);
  }

  static leaveRoom(name, userId) {
    return this.getRoom(name)?.leave(userId);
  }

  static setSpectate(name, userId, spectate) {
    return this.getRoom(name)?.setSpectate(userId, spectate);
  }

  static getUsers(name) {
    return this.getRoom(name)?.getUsers();
  }

  static banUser(name, userId, toBanId) {
    return this.getRoom(name)?.ban(userId, toBanId);
  }
}

module.exports = Rooms;
