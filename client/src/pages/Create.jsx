import { useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useUser } from "../context/userContext";
import useStyles from "./styles";

import BackButton from "../components/BackButton";
import Button from "../components/Button";

function Create() {
  const { userId } = useUser();
  const [capacity, setCapacity] = useState("");
  const history = useHistory();
  const classes = useStyles();

  const createRoom = useCallback(() => {
    if (userId) {
      const cap = capacity || "-1";
      fetch(
        `/room/new?${new URLSearchParams({
          userId,
          capacity: cap,
        })}`
      )
        .then((res) => res.json())
        .then((room) => history.push(`/room/${room.name}`));
    }
  }, [userId, history, capacity]);

  return (
    <div className={classes.page}>
      <BackButton />
      <input
        type="text"
        className={classes.box}
        value={capacity}
        placeholder="Enter a room capacity (empty for infinite)"
        onKeyUp={(e) => e.key === "Enter" && createRoom()}
        onInput={(e) => setCapacity(e.target.value.toUpperCase())}
      />
      <Button title="Create Lobby" onClick={createRoom} />
    </div>
  );
}

export default Create;
