import { useState, useEffect, useCallback, useRef } from "react";

import PropTypes from "prop-types";
import { useSocket } from "../../context/socketContext";
import useToggle from "../../context/useToggle";
import useStyles from "./styles";

function User({ name, userId, myId, userIsMod, userIsSpectator }) {
  const { sendMessage } = useSocket();
  const classes = useStyles();
  const [changingName, setChangingName] = useState(false);
  const [nextName, setNextName] = useState(name);
  const editNameBoxRef = useRef();

  const canChangeName = myId === userId;

  const changeName = useCallback(() => {
    sendMessage({ type: "changeName", payload: { name: nextName } });
    setChangingName(false);
    editNameBoxRef.current.blur();
  }, [sendMessage, nextName, setChangingName, editNameBoxRef]);

  const startChangingName = useCallback(() => {
    setChangingName(true);
    if (editNameBoxRef.current) editNameBoxRef.current.focus();
  }, [setChangingName]);

  useEffect(() => {
    if (changingName) editNameBoxRef.current.focus();
  }, [changingName]);

  return (
    <div key={`userBox-${userId}`} className={classes.userBox}>
      <div className={classes.changeUserBox}>
        <input
          type="text"
          className={classes.smallBox}
          value={nextName}
          onKeyUp={(e) =>
            e.key === "Enter" &&
            (changingName ? changeName() : startChangingName())
          }
          onInput={(e) => setNextName(e.target.value)}
          disabled={!canChangeName || !changingName}
          ref={editNameBoxRef}
        />
        {canChangeName && (
          <button
            type="button"
            tabIndex={0}
            className={classes.userSaveButton}
            onClick={(e) => (changingName ? changeName() : startChangingName())}
            onKeyUp={(e) =>
              e.key === "Enter" &&
              (changingName ? changeName() : startChangingName())
            }
          >
            {changingName ? "Save" : "Edit Name"}
          </button>
        )}
      </div>
      {myId !== userId ? (
        userIsMod && (
          <>
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
            {userIsSpectator && (
              <button
                type="submit"
                className={classes.addButton}
                onClick={() =>
                  sendMessage &&
                  sendMessage({
                    type: "modUnspectate",
                    payload: { id: userId },
                  })
                }
              >
                Add
              </button>
            )}
          </>
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
  userIsSpectator: PropTypes.bool.isRequired,
};

export default User;
