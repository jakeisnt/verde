const Rooms = require("../engine/rooms");

class Users {
  static joinRoom(name, userId) {
    return Rooms.getRoom(name)?.join(userId);
  }

  static leaveRoom(name, userId) {
    return Rooms.getRoom(name)?.leave(userId);
  }

  static setSpectate(name, userId, spectate) {
    return Rooms.getRoom(name)?.setSpectate(userId, spectate);
  }

  static getUsers(name) {
    return Rooms.getRoom(name)?.getUsers();
  }

  static banUser(name, userId, toBanId) {
    return Rooms.getRoom(name)?.ban(userId, toBanId);
  }

  static modSetSpectate(name, modId, toSetId, spectate) {
    return Rooms.getRoom(name)?.modSetSpectate(modId, toSetId, spectate);
  }

  static unspectateAllUsers(name, modId) {
    return Rooms.getRoom(name)?.unspectateAll(modId);
  }

  static nominateMod(name, modId, newModId) {
    return Rooms.getRoom(name)?.nominateMod(modId, newModId);
  }
}

module.exports = Users;
