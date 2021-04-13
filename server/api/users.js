const Rooms = require("../engine/rooms");
const Users = require("../engine/users");

class Users2 {
  // static joinRoom(name, userId) {
  //   return Rooms.getRoom(name)?.join(userId);
  // }

  // static leaveRoom(name, userId) {
  //   return Rooms.getRoom(name)?.leave(userId);
  // }

  static connect(name, userId) {
    return Rooms.joinRoom(name, userId);
  }

  static disconnect(name, userId) {
    return Rooms.leaveRoom(name, userId);
  }

  static changeName(roomName, userId, { name }) {
    return Users.setName(userId, name);
  }

  static spectate(name, userId) {
    return Rooms.getRoom(name)?.setSpectate(userId, true);
  }

  static unspectate(name, userId) {
    return Rooms.getRoom(name)?.setSpectate(userId, false);
  }

  static modUnspectate(roomName, userId, { id }) {
    Rooms.modSetSpectate(roomName, userId, id, false);
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
