import PropTypes from "prop-types";
import User from "./User";
import useStyles from "../styles";

function UserList({ users, title, capacity, myId, userIsMod }) {
  const classes = useStyles();

  return users && users.length > 0 ? (
    <>
      {title}
      {capacity &&
        `: ${users && users.length}/${capacity >= 0 ? capacity : "∞"}`}
      <div className={classes.box}>
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
                />
              )
          )}
      </div>
    </>
  ) : null;
}

UserList.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
  capacity: PropTypes.number,
  myId: PropTypes.string.isRequired,
  userIsMod: PropTypes.bool.isRequired,
};

UserList.defaultProps = {
  capacity: null,
};

export default UserList;
