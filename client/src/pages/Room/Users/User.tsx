import { useState, useEffect, useCallback, useRef } from "react";
import useStyles from "./styles";
import { useGameActions } from "../../../context";
import { Button } from "../../../components";


/**
 * Renders a single user in a list of users.
 * Offers options to spectate, unspectate, edit name, etc. based on the player's status.
 */
function User({
  name,
  userId,
  myId,
  userIsMod,
  userIsSpectator = false,
  inactiveUser = false,
}: {
  name: string;
  userId: string;
  myId: string;
  userIsMod: boolean;
  userIsSpectator: boolean;
  inactiveUser: boolean;
}) {
  const { unspectateUser, banUser, nominateMod, changeName } = useGameActions();
  const classes = useStyles();
  const [changingName, setChangingName] = useState(false);
  const [nextName, setNextName] = useState(name);
  const editNameBoxRef = useRef<HTMLInputElement>(null);

  const canChangeName = myId === userId;

  const setNewName = useCallback(() => {
    changeName(nextName);
    setChangingName(false);
    if (editNameBoxRef.current) editNameBoxRef.current.blur();
  }, [changeName, nextName, setChangingName, editNameBoxRef]);

  const startChangingName = useCallback(() => {
    setChangingName(true);
    if (editNameBoxRef.current) editNameBoxRef.current.focus();
  }, [setChangingName]);

  useEffect(() => {
    if (changingName && editNameBoxRef.current) editNameBoxRef.current.focus();
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
            // this was commented out
            (changingName ? setNewName() : startChangingName())
          }
          onInput={(e) => setNextName((e.target as HTMLInputElement).value)}
          disabled={!canChangeName || !changingName}
          ref={editNameBoxRef}
        />
        {canChangeName && (
          <Button
            title={changingName ? "Save" : "Edit Name"}
            onClick={() => (changingName ? setNewName() : startChangingName())}
            // SHORTCUT: not defined on the component (? maybe fix it)
            // onKeyUp={(e) =>
            //   e.key === "Enter" &&
            //   (changingName ? setNewName() : startChangingName())
            // }
          />
        )}
      </div>
      {myId !== userId ? (
        userIsMod && (
          <>
            <Button title="Ban" onClick={() => banUser(userId)} />
            {userIsSpectator && (
              <Button title="Add" onClick={() => unspectateUser(userId)} />
            )}
            {!inactiveUser && (
              <Button title="Make Mod" onClick={() => nominateMod(userId)} />
            )}
          </>
        )
      ) : (
        <p>Me{userIsMod && ", Mod"}</p>
      )}
    </div>
  );
}

export default User;
