import PropTypes from "prop-types";
import { useGameActions } from "../../../context";
import User from "./User";
import useStyles from "./styles";
import { Button } from "../../../components";

function SpectatorList({ users, capacity, myId, userIsMod }) {
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
        {userIsMod && <Button title="Admit All" onClick={unspectateAll} />}
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
