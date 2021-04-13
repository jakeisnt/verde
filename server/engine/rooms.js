const Users = require("./users");
const Game = require("./games");

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
    this.locked = true;
    this.game = null;
  }

  getNumPlayers() {
    return this.getUsers().players.length;
  }

  getGame() {
    return this.game;
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
    return this.capacity < 0 || this.getNumPlayers() < this.capacity;
  }

  getCurrentPlayers() {
    return this.users.filter(({ present, spectate }) => present && !spectate);
  }

  isModerator(userId) {
    // The moderator is the first added active player.
    return (
      this.getNumPlayers() > 0 && userId === this.getCurrentPlayers()[0].id
    );
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
      if (!this.canJoinAsPlayer()) user.spectate = true;
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
      const { spectators } = this.getUsers();
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

  setSpectate(userId, spectate, byMod) {
    console.log(`Setting ${userId}'s spectate status to ${spectate}`);
    if (this.isBanned(userId)) return undefined;
    const index = this.users.findIndex(({ id }) => id === userId);
    if (index < 0) return undefined;
    const user = this.users[index];
    if (!user.present) return undefined;
    if (spectate) {
      if (!user.spectate) {
        user.spectate = true;
        this.users.splice(index, 1);
        this.users.push(user);
      }
    } else if (this.canJoinAsPlayer() || byMod) {
      if (user.spectate) {
        user.spectate = false;
        this.users.splice(index, 1);
        this.users.push(user);
      }
    }

    this.promoteSpectator();
    return user;
  }

  // Allow moderator to set spectate status for another user
  modSetSpectate(modId, userId, spectate) {
    if (!this.isModerator(modId)) return undefined;
    return this.setSpectate(userId, spectate, true);
  }

  unspectateAll(modId) {
    if (!this.isModerator(modId)) return undefined;

    const { spectators } = this.getUsers();
    spectators.forEach(({ id }) => this.setSpectate(id, false, true));

    return this.getUsers();
  }

  nominateMod(modId, newModId) {
    console.log(`${modId} has nominated ${newModId} to be the new mod`);
    if (!this.isModerator(modId) || this.isBanned(newModId)) return undefined;

    const index = this.users.findIndex(({ id }) => id === newModId);
    if (index < 0) return undefined;
    const user = this.users[index];
    if (!user.present) return undefined;

    this.users.splice(index, 1);
    user.spectate = false;
    this.users.unshift(user);

    return user;
  }

  startGame() {
    if (!this.game) {
      const { players } = this.getUsers();
      this.game = new Game(players);
    }
    return this.game?.start();
  }

  getGameState() {
    return this.game ? this.game.getGameState() : undefined;
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

  static getUsers(name) {
    return this.getRoom(name)?.getUsers();
  }

  static banUser(name, userId, toBanId) {
    return this.getRoom(name)?.ban(userId, toBanId);
  }

  static modSetSpectate(name, modId, toSetId, spectate) {
    return this.getRoom(name)?.modSetSpectate(modId, toSetId, spectate);
  }

  static unspectateAllUsers(name, modId) {
    return this.getRoom(name)?.unspectateAll(modId);
  }

  static nominateMod(name, modId, newModId) {
    return this.getRoom(name)?.nominateMod(modId, newModId);
  }

  static startGame(name, modId) {
    return this.getRoom(name)?.startGame();
  }

  static stopGame(name, modId) {
    return this.getRoom(name)?.getGame()?.stop();
  }

  static takeAction(name, playerId, action) {
    return this.getRoom(name)?.getGame()?.takeAction(playerId, action);
  }

  static passTurn(name, playerId) {
    const game = this.getRoom(name)?.getGame()?.passTurn(playerId);
  }

  static getGameState(roomName) {
    return this.getRoom(name)?.getGameState();
  }
}

module.exports = Rooms;
