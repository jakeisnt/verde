import PropTypes from "prop-types";
import { useSocket } from "../../context/socketContext";
import User from "./User";
import useStyles from "../styles";

function SpectatorList({ users, capacity, myId, userIsMod, userIsSpectator }) {
  const classes = useStyles();
  const { sendMessage } = useSocket();

  return users && users.length > 0 ? (
    <>
      <div className={classes.flexRow}>
        <div>
          Spectators
          {capacity &&
            `: ${users && users.length}/${capacity >= 0 ? capacity : "∞"}`}
        </div>
        {userIsMod && (
          <button
            type="button"
            className={classes.box}
            onClick={() =>
              sendMessage &&
              sendMessage({
                type: "unspectateAll",
              })
            }
          >
            Admit All
          </button>
        )}
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
                />
              )
          )}
      </div>
    </>
  ) : null;
}

SpectatorList.propTypes = {
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

SpectatorList.defaultProps = {
  capacity: null,
};

export default SpectatorList;
