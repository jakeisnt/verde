import PropTypes from "prop-types";
import User from "./User";
import { Box } from "../../../components";

/** A list of users in the game. */

function UserList({
  users,
  title,
  capacity,
  myId,
  userIsMod,
}: {
  users: User[];
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
                  inactiveUser
                />
              )
          )}
      </Box>
    </>
  ) : null;
}

export default UserList;
