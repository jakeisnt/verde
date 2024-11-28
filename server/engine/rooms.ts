import Users from "./users";
import Game from "./games";
import { logger } from "../logger";

/** Bijective hash on 32-bit ints */
function hashInt32(x: number): number {
  let h = x | 0;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h ^= h >> 16;
  return h;
}

const nameLen = 4;

interface User {
  id: string;
  name: string;
  [key: string]: any;
}

// represents a user in a room
class RoomUser {
  id: string;
  present: boolean;
  spectate: boolean;
  banned: boolean;
  count: number;

  constructor(id: string) {
    this.id = id;
    this.present = true;
    this.spectate = false;
    this.banned = false;
    this.count = 0;
  }
}

interface RoomUsers {
  players: User[];
  inactives: User[];
  spectators: User[];
  banned: User[];
}

// represents a room in the game
class Room {
  name: string;
  capacity: number;
  users: RoomUser[];
  locked: boolean;
  game: Game | null;

  constructor(name: string, capacity: number = -1) {
    this.name = name;
    this.capacity = capacity;
    this.users = [];
    this.locked = true;
    this.game = null;
  }

  // gets number of players
  getNumPlayers(): number {
    return this.getUsers().players.length;
  }

  getGame(): Game | null {
    return this.game;
  }

  // fetches all the user information about the game
  getUsers(): RoomUsers {
    const players: User[] = [];
    const inactives: User[] = [];
    const bannedUsers: User[] = [];
    const spectators: User[] = [];
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

  // determines whether an arbitrary user can join as a player
  canJoinAsPlayer(): boolean {
    if (this.locked) return false;
    return this.capacity < 0 || this.getNumPlayers() < this.capacity;
  }

  // gets all the game's current players
  getCurrentPlayers(): RoomUser[] {
    return this.users.filter(({ present, spectate }) => present && !spectate);
  }

  // determines whether a provided userId is a game moderator
  isModerator(userId: string): boolean {
    // The moderator is the first added active player.
    return (
      this.getNumPlayers() > 0 && userId === this.getCurrentPlayers()[0].id
    );
  }

  // determines whether a player is banned
  isBanned(userId: string): boolean {
    return this.getUser(userId)?.banned ?? false;
  }

  // gets a user given their userId
  getUser(userId: string): RoomUser | undefined {
    const index = this.users.findIndex(({ id }) => id === userId);
    return index >= 0 ? this.users[index] : undefined;
  }

  // fetches a user, creating a user with that userId if they don't exist
  getOrMakeUser(userId: string): RoomUser {
    return this.getUser(userId) || new RoomUser(userId);
  }

  // connect a user to the game
  join(userId: string): RoomUser | undefined {
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

  // promote a spectator to a player of the game to moderator as needed
  promoteSpectator(): void {
    // if there are no more players, promote a spectator
    if (this.getNumPlayers() === 0) {
      const { spectators } = this.getUsers();
      if (spectators.length > 0) {
        const upgradee = spectators[0].id;
        logger.info(`Upgrading spectator ${upgradee} to moderator!`);
        const user = this.getUser(upgradee);
        if (user) user.spectate = false;
        // but if there are no more spectators, close the room
      } else {
        logger.info(
          `There are no more spectators to upgrade to moderators. The room is effectively closed.`
        );
        // close the room?
      }
    }
  }

  // have the user with the provided userId leave the room
  leave(userId: string): RoomUser | undefined {
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

  // ban the player with id banneeId, assumming bannerId has the proper credentials
  ban(bannerId: string, banneeId: string): void | undefined {
    if (!this.isModerator(bannerId)) return undefined;
    this.users.forEach((user) => {
      if (user.id === banneeId) user.banned = true;
    });
  }

  // set the spectate status of a user
  setSpectate(
    userId: string,
    spectate: boolean,
    byMod: boolean
  ): RoomUser | undefined {
    logger.info(`Setting ${userId}'s spectate status to ${spectate}`);
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
  modSetSpectate(
    modId: string,
    userId: string,
    spectate: boolean
  ): RoomUser | undefined {
    if (!this.isModerator(modId)) return undefined;
    return this.setSpectate(userId, spectate, true);
  }

  // unspectate all users, bringing them all into the game
  unspectateAll(modId: string): RoomUsers | undefined {
    if (!this.isModerator(modId)) return undefined;

    const { spectators } = this.getUsers();
    spectators.forEach(({ id }) => this.setSpectate(id, false, true));

    return this.getUsers();
  }

  // allow a moderator to nominate another moderator to replace them
  nominateMod(modId: string, newModId: string): RoomUser | undefined {
    logger.info(`${modId} has nominated ${newModId} to be the new mod`);
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

  // start the game if a mod
  startGame(modId: string): void | undefined {
    if (!this.isModerator(modId)) return undefined;
    const { players } = this.getUsers();
    this.game = new Game(players);
    return this.game?.start();
  }

  // stop the game if a moderator
  stopGame(modId: string): void | undefined {
    if (!this.isModerator(modId)) return undefined;
    return this.game?.stop();
  }

  // provide the raw game state
  getGameState(): any | undefined {
    return this.game ? this.game.getGameState() : undefined;
  }
}

// manage the rooms of the game
class Rooms {
  static count = Math.floor(Math.random() * 9001) | 0;

  static rooms: Record<string, Room> = {};

  // generate a name for the next room
  static nextName(): string {
    let h = hashInt32(this.count);
    const name: string[] = [];
    for (let i = 0; i < nameLen; i += 1) {
      name.push(String.fromCharCode("A".charCodeAt(0) + (h % 26)));
      h = (h / 26) | 0;
    }
    this.count += 1;
    return name.join("");
  }

  // create a new room
  static createRoom(userId: string, capacity: number = -1): Room {
    const name = this.nextName();
    const room = new Room(name, capacity);
    this.rooms[name] = room;
    return room;
  }

  // delete a room
  static deleteRoom(name: string): void {
    if (name in this.rooms) delete this.rooms[name];
  }

  // fetch the room with the given name
  static getRoom(name: string): Room | undefined {
    return this.rooms[name];
  }

  // user with userid joins room with name
  static joinRoom(name: string, userId: string): RoomUser | undefined {
    return this.getRoom(name)?.join(userId);
  }

  // user with userid leaves room with name
  static leaveRoom(name: string, userId: string): RoomUser | undefined {
    return this.getRoom(name)?.leave(userId);
  }

  // get all of the users in a room
  static getUsers(name: string): RoomUsers | undefined {
    return this.getRoom(name)?.getUsers();
  }

  // ban a user from a room
  static banUser(
    name: string,
    userId: string,
    toBanId: string
  ): void | undefined {
    return this.getRoom(name)?.ban(userId, toBanId);
  }

  // set the spectate status of another player
  static modSetSpectate(
    name: string,
    modId: string,
    toSetId: string,
    spectate: boolean
  ): RoomUser | undefined {
    return this.getRoom(name)?.modSetSpectate(modId, toSetId, spectate);
  }

  // make every spectator a player
  static unspectateAllUsers(
    name: string,
    modId: string
  ): RoomUsers | undefined {
    return this.getRoom(name)?.unspectateAll(modId);
  }

  // allow mod to elect a new moderator to replace them
  static nominateMod(
    name: string,
    modId: string,
    newModId: string
  ): RoomUser | undefined {
    return this.getRoom(name)?.nominateMod(modId, newModId);
  }

  // start the game
  static startGame(name: string, modId: string): void | undefined {
    return this.getRoom(name)?.startGame(modId);
  }

  // stop the game
  static stopGame(name: string, modId: string): void | undefined {
    return this.getRoom(name)?.stopGame(modId);
  }

  // allow the player with the provided playerId to take a game action
  static takeAction(
    name: string,
    playerId: string,
    action: string,
    payload: any
  ): any | undefined {
    return this.getRoom(name)?.getGame()?.takeAction(playerId, action, payload);
  }

  // pass the turn from the player with the given playerId
  static passTurn(name: string, playerId: string): any | undefined {
    return this.getRoom(name)?.getGame()?.passTurn(playerId);
  }

  // produce the room's current game state
  static getGameState(name: string): any | undefined {
    return this.getRoom(name)?.getGameState();
  }
}

export default Rooms;
