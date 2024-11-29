import User from "./User";
import { Box } from "../../../components";

type UserType = {
  userIsSpectator: boolean;
  inactiveUser: boolean;
  id: string;
  name: string;
};

/* A list of active players in the game.
 * Assume every user provided in the list of users is a player.
 */
function PlayerList({
  users,
  capacity,
  myId,
  userIsMod,
}: {
  users: UserType[];
  capacity: number | null;
  myId: string;
  userIsMod: boolean;
}) {
  return users && users.length > 0 ? (
    <>
      <div>
        Players
        {capacity &&
          `: ${users && users.length}/${capacity >= 0 ? capacity : "∞"}`}
      </div>
      <Box>
        {users &&
          users.map(
            (user) =>
              user && (
                <User
                  key={user.id}
                  name={user.name}
                  userId={user.id}
                  myId={myId}
                  userIsMod={userIsMod}
                  // SHORTCUT: not defined on the component (? maybe fix it)
                  userIsSpectator={false}
                  inactiveUser={false}
                />
              )
          )}
      </Box>
    </>
  ) : null;
}

export default PlayerList;
