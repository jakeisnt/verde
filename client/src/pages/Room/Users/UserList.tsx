import User from "./User";
import { Box } from "../../../components";

type UserType = {
  id: string;
  name: string;
};

/**
 * A list of users in the game.
 */
function UserList({
  users,
  title,
  capacity,
  myId,
  userIsMod,
}: {
  users: UserType[];
  title: string;
  capacity: number | null;
  myId: string;
  userIsMod: boolean;
}) {
  return users && users.length > 0 ? (
    <>
      {title}
      {capacity &&
        `: ${users && users.length}/${capacity >= 0 ? capacity : "∞"}`}
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
                  inactiveUser
                />
              )
          )}
      </Box>
    </>
  ) : null;
}

export default UserList;
