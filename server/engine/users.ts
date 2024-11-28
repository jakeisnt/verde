/** Bijective hash on 32-bit ints */
function hashInt32(x: number): number {
  let h = x | 0;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h ^= h >> 16;
  return h;
}

const idLen = 9;

interface User {
  id: string;
  name: string;
}

// represents all of the users in the game
class Users {
  static count = Math.floor(Math.random() * 9001) | 0;

  static users: Record<string, User> = {};

  // generate a new userId
  static nextId(): string {
    let h = hashInt32(this.count);
    const id: string[] = [];
    for (let i = 0; i < idLen; i += 1) {
      id.push(`${h % 10}`);
      h = (h / 10) | 0;
    }
    this.count += 1;
    return id.join("");
  }

  // create a user
  static createUser(): User {
    const id = this.nextId();
    const user: User = { id, name: `user${id}` };
    this.users[id] = user;
    return user;
  }

  // fetch a user with the provided id
  static getUser(id: string): User | undefined {
    if (id in this.users) return this.users[id];
    return undefined;
  }

  // set the name of a user
  static setName(id: string, name: string): User | undefined {
    if (id in this.users) {
      this.users[id].name = name;
      return this.users[id];
    }
    return undefined;
  }
}

export default Users;
