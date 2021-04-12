import PropTypes from "prop-types";
import User from "./User";
import useStyles from "../../styles";

function PlayerList({ users, capacity, myId, userIsMod }) {
  const classes = useStyles();

  return users && users.length > 0 ? (
    <>
      <div>
        Players
        {capacity &&
          `: ${users && users.length}/${capacity >= 0 ? capacity : "∞"}`}
      </div>
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
                  userIsSpectator
                  playerList
                />
              )
          )}
      </div>
    </>
  ) : null;
}

PlayerList.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  capacity: PropTypes.number,
  myId: PropTypes.string.isRequired,
  userIsMod: PropTypes.bool.isRequired,
};

PlayerList.defaultProps = {
  capacity: null,
};

export default PlayerList;
