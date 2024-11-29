import Rooms from "../engine/rooms";

/** Represents all of the actions users can take in a room.
 * Include a static method on this class that accepts the room name,
 * userId, and an optional payload as arguments, and the function
 * will be callable as a socket action from the client side.
 */
class Connect {
  static connect(name: string, userId: string) {
    return Rooms.joinRoom(name, userId);
  }

  static disconnect(name: string, userId: string) {
    return Rooms.leaveRoom(name, userId);
  }
}

export default Connect;
