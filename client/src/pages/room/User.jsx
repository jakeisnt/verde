import PropTypes from "prop-types";
import { useSocket } from "../../context/socketContext";

import { createUseStyles } from "react-jss";

const useStyles = createUseStyles((theme) => ({
  userBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  banButton: {
    border: `2px solid ${theme.red}`,
    padding: "auto",
    backgroundColor: theme.white,
  },
}));

function User({ name, userId, myId, userIsMod }) {
  const { sendMessage } = useSocket();
  const classes = useStyles();

  return (
    <div key={`userBox-${userId}`} className={classes.userBox}>
      <p key={userId}>{name}</p>
      {myId !== userId ? (
        userIsMod && (
          <button
            type="submit"
            className={classes.banButton}
            onClick={() =>
              sendMessage &&
              sendMessage({
                type: "banUser",
                payload: { toBanId: userId },
              })
            }
          >
            Ban
          </button>
        )
      ) : (
        <>
          <p>Me</p>
          {userIsMod && <p>Mod</p>}
        </>
      )}
    </div>
  );
}

User.propTypes = {
  name: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  myId: PropTypes.string.isRequired,
  userIsMod: PropTypes.bool.isRequired,
};

export default User;
