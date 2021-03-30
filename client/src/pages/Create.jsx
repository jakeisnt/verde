import { useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useUser } from "../context/userContext";
import useStyles from "./styles";

import BackButton from "../components/BackButton";

function Create() {
  const { user } = useUser();
  const [capacity, setCapacity] = useState(-1);
  const history = useHistory();
  const classes = useStyles();

  const createRoom = useCallback(
    () =>
      user &&
      fetch(`/room/new?${new URLSearchParams({ userId: user.id, capacity })}`)
        .then((res) => res.json())
        .then((room) => history.push(`/room/${room.name}`)),
    [user, history, capacity]
  );

  return (
    <div className={classes.home}>
      <BackButton />
      <input
        type="text"
        className={classes.box}
        value={capacity}
        placeholder="Enter a room capacity"
        onKeyUp={(e) => e.key === "Enter" && createRoom()}
        onInput={(e) => setCapacity(e.target.value.toUpperCase())}
      />
      <button
        type="button"
        className={classes.box}
        onClick={() => createRoom()}
      >
        Create Lobby
      </button>
    </div>
  );
}

export default Create;
