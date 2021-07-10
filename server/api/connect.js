import Rooms from "../engine/rooms";
import Users from "../engine/users";
import { logger } from "../logger";

/** Represents all of the actions users can take in a room.
 * Include a static method on this class that accepts the room name,
 * userId, and an optional payload as arguments, and the function
 * will be callable as a socket action from the client side.
 */
class Connect {
  static connect(name, userId) {
    return Rooms.joinRoom(name, userId);
  }

  static disconnect(name, userId) {
    return Rooms.leaveRoom(name, userId);
  }
}

export default Connect;
