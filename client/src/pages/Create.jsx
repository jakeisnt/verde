import { useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useUser } from "../context/userContext";
import useStyles from "./styles";

import BackButton from "../components/BackButton";

function Create() {
  const { userId } = useUser();
  const [capacity, setCapacity] = useState("");
  const history = useHistory();
  const classes = useStyles();

  const createRoom = useCallback(() => {
    if (userId) {
      const cap = capacity || "-1";
      fetch(`/room/new?${new URLSearchParams({ userId, capacity: cap })}`)
        .then((res) => res.json())
        .then((room) => history.push(`/room/${room.name}`));
    }
  }, [userId, history, capacity]);

  return (
    <div className={classes.home}>
      <BackButton />
      <input
        type="text"
        className={classes.box}
        value={capacity}
        placeholder="Enter a room capacity (empty for infinite)"
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
