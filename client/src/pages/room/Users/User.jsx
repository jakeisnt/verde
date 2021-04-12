import { useState, useEffect, useCallback, useRef } from "react";

import PropTypes from "prop-types";
import { useSocket } from "../../context/socketContext";
import { useGameActions } from "../../context/socketContext";
import useToggle from "../../context/useToggle";
import useStyles from "./styles";

function User({
  name,
  userId,
  myId,
  userIsMod,
  userIsSpectator,
  playerList,
  inactiveUser,
}) {
  const { unspectateUser, banUser, nominateMod, changeName } = useGameActions();
  const classes = useStyles();
  const [changingName, setChangingName] = useState(false);
  const [nextName, setNextName] = useState(name);
  const editNameBoxRef = useRef();

  const canChangeName = myId === userId;

  const changeName = useCallback(() => {
    changeName(nextName);
    setChangingName(false);
    editNameBoxRef.current.blur();
  }, [changeName, nextName, setChangingName, editNameBoxRef]);

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
          <Button
            title={changingName ? "Save" : "Edit Name"}
            className={classes.userSaveButton}
            onClick={(e) => (changingName ? changeName() : startChangingName())}
            onKeyUp={(e) =>
              e.key === "Enter" &&
              (changingName ? changeName() : startChangingName())
            }
          />
        )}
      </div>
      {myId !== userId ? (
        userIsMod && (
          <>
            <Button
              title="Ban"
              className={classes.banButton}
              onClick={() => banUser(userId)}
            />
            {userIsSpectator && (
              <Button
                title="Add"
                className={classes.addButton}
                onClick={() => unpsectateUser(userId)}
              />
            )}
            {!inactiveUser && (
              <Button
                title="Make Mod"
                className={classes.addButton}
                onClick={() => nominateMod(userId)}
              />
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
  userIsSpectator: PropTypes.bool,
  playerList: PropTypes.bool,
  inactiveUser: PropTypes.bool,
};

User.defaultProps = {
  userIsSpectator: false,
  playerList: false,
  inactiveUser: false,
};

export default User;
