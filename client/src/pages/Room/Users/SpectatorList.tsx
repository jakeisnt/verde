import { useGameActions } from "../../../context";
import User from "./User";
import useStyles from "./styles";
import { Button, Box } from "../../../components";

type UserType = {
  id: string;
  name: string;
};

/** A list of spectators in the game.
 * Assume every user provided in the list of users is a spectator.
 */

function SpectatorList({
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
  const classes = useStyles();
  const { unspectateAll } = useGameActions();

  return users && users.length > 0 ? (
    <>
      <div className={classes.flexRow}>
        <div>
          Spectators
          {capacity &&
            `: ${users && users.length}/${capacity >= 0 ? capacity : "∞"}`}
        </div>
        {userIsMod && (
          <Button title="Admit All" onClick={() => unspectateAll()} />
        )}
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
                  userIsSpectator
                  inactiveUser={false}
                />
              )
          )}
      </Box>
    </>
  ) : null;
}

export default SpectatorList;
