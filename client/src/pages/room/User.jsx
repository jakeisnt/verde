import { useState, useEffect, useCallback, useRef } from "react";

import PropTypes from "prop-types";
import { useSocket } from "../../context/socketContext";
import useToggle from "../../context/useToggle";
import useStyles from "./styles";

function User({ name, userId, myId, userIsMod }) {
  const { sendMessage } = useSocket();
  const classes = useStyles();
  const [changingName, toggleChangingName] = useToggle();
  const [nextName, setNextName] = useState(name);
  const editNameBoxRef = useRef();

  const canChangeName = myId === userId;

  const changeName = useCallback(() => {
    sendMessage({ type: "changeName", payload: { name: nextName } });
    toggleChangingName();
  }, [sendMessage, nextName, toggleChangingName]);

  const startChangingName = useCallback(() => {
    setNextName(name);
    toggleChangingName();
    if (editNameBoxRef.current) editNameBoxRef.current.focus();
  }, [name, toggleChangingName]);

  useEffect(() => {
    if (changingName) editNameBoxRef.current.focus();
  }, [changingName]);

  return (
    <div key={`userBox-${userId}`} className={classes.userBox}>
      <div className={classes.changeUserBox}>
        <div
          role="button"
          onClick={() => startChangingName()}
          onKeyUp={(e) => e.key === "Enter" && startChangingName()}
          tabIndex={canChangeName ? 0 : -1}
          disabled={!canChangeName}
        >
          <input
            type="text"
            className={classes.smallBox}
            value={nextName}
            placeholder="Enter a new username"
            onKeyUp={(e) => e.key === "Enter" && changeName()}
            onInput={(e) => setNextName(e.target.value)}
            disabled={!canChangeName || !changingName}
            ref={editNameBoxRef}
          />
        </div>
        {canChangeName && (
          <button
            type="button"
            tabIndex={0}
            className={classes.userSaveButton}
            onClick={() => changeName()}
            onKeyDown={(e) => e.key === "Enter" && changeName()}
          >
            {changingName ? "Save" : "Edit Name"}
          </button>
        )}
      </div>
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
