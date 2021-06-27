const Rooms = require("../engine/rooms");
const Users = require("../engine/users");
const { logger } = require("../logger");

class Users2 {
  static connect(name, userId) {
    return Rooms.joinRoom(name, userId);
  }

  static disconnect(name, userId) {
    return Rooms.leaveRoom(name, userId);
  }

  static changeName(roomName, userId, { name }) {
    logger.info(`Setting the name of ${userId} to ${name}`);
    return Users.setName(userId, name);
  }

  static spectate(name, userId) {
    return Rooms.getRoom(name)?.setSpectate(userId, true);
  }

  static unspectate(name, userId) {
    return Rooms.getRoom(name)?.setSpectate(userId, false);
  }

  static getUsers(name) {
    return Rooms.getRoom(name)?.getUsers();
  }

  static banUser(name, userId, { toBanId }) {
    return Rooms.getRoom(name)?.ban(userId, toBanId);
  }

  static unspectateUser(name, modId, { id }) {
    return Rooms.getRoom(name)?.modSetSpectate(modId, id, false);
  }

  static unspectateAll(name, modId) {
    return Rooms.getRoom(name)?.unspectateAll(modId);
  }

  static nominateMod(name, modId, { id }) {
    return Rooms.getRoom(name)?.nominateMod(modId, id);
  }
}

module.exports = Users2;
