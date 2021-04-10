import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useSocket } from "../../context/socketContext";
import useToggle from "../../context/useToggle";
import useStyles from "./styles";

function User({ name, userId, myId, userIsMod }) {
  const { sendMessage } = useSocket();
  const classes = useStyles();
  const [changingName, toggleChangingName] = useToggle();
  const [nextName, setNextName] = useState(name);

  const changeName = useCallback(() => {
    sendMessage({ type: "changeName", payload: { name: nextName } });
    toggleChangingName();
  }, [sendMessage, nextName, toggleChangingName]);

  const startChangingName = useCallback(() => {
    setNextName(name);
    toggleChangingName();
  }, [name, toggleChangingName]);

  return (
    <div key={`userBox-${userId}`} className={classes.userBox}>
      {changingName ? (
        <div className={classes.changeUserBox}>
          <input
            type="text"
            className={classes.smallBox}
            value={nextName}
            placeholder="Enter a new username"
            onKeyUp={(e) => e.key === "Enter" && changeName()}
            onInput={(e) => setNextName(e.target.value)}
          />
          <button
            type="button"
            tabIndex={0}
            className={classes.userSaveButton}
            onClick={() => changeName()}
            onKeyDown={(e) => e.key === "Enter" && changeName()}
          >
            Save
          </button>
        </div>
      ) : (
        <div
          key={userId}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && changeName()}
          onClick={() => startChangingName()}
        >
          <p>{name}</p>
        </div>
      )}
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
        <p>Me{userIsMod && ", Mod"}</p>
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
