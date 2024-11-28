import Rooms from "../engine/rooms";
import Users from "../engine/users";
import { logger } from "../logger";

/** Represents all of the actions users can take in a room.
 * Include a static method on this class that accepts the room name,
 * userId, and an optional payload as arguments, and the function
 * will be callable as a socket action from the client side.
 */
class UserAPI {
  static connect(name: string, userId: string): boolean {
    return Rooms.joinRoom(name, userId);
  }

  static disconnect(name: string, userId: string): boolean {
    return Rooms.leaveRoom(name, userId);
  }

  static changeName(roomName: string, userId: string, { name }: { name: string }): boolean {
    logger.info(`Setting the name of ${userId} to ${name}`);
    return Users.setName(userId, name);
  }

  static spectate(name: string, userId: string): boolean | undefined {
    return Rooms.getRoom(name)?.setSpectate(userId, true);
  }

  static unspectate(name: string, userId: string): boolean | undefined {
    return Rooms.getRoom(name)?.setSpectate(userId, false);
  }

  static getUsers(name: string): any | undefined {
    return Rooms.getRoom(name)?.getUsers();
  }

  static banUser(name: string, userId: string, { toBanId }: { toBanId: string }): boolean | undefined {
    return Rooms.getRoom(name)?.ban(userId, toBanId);
  }

  static unspectateUser(name: string, modId: string, { id }: { id: string }): boolean | undefined {
    return Rooms.getRoom(name)?.modSetSpectate(modId, id, false);
  }

  static unspectateAll(name: string, modId: string): boolean | undefined {
    return Rooms.getRoom(name)?.unspectateAll(modId);
  }

  static nominateMod(name: string, modId: string, { id }: { id: string }): boolean | undefined {
    return Rooms.getRoom(name)?.nominateMod(modId, id);
  }
}

export default UserAPI;
