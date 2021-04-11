import { useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useUser } from "../context/userContext";
import useStyles from "./styles";

import BackButton from "../components/BackButton";

// Determines whether users spectate.
const RoomBehavior = {
  USER_SPECTATE: "user-spectate",
  MOD_SPECTATE: "mod-spectate",
};

function Create() {
  const { userId } = useUser();
  const [capacity, setCapacity] = useState("");
  const [roomEnterBehavior, setEnterBehavior] = useState(
    RoomBehavior.USER_SPECTATE
  );
  const history = useHistory();
  const classes = useStyles();

  const createRoom = useCallback(() => {
    if (userId) {
      const cap = capacity || "-1";
      fetch(
        `/room/new?${new URLSearchParams({
          userId,
          capacity: cap,
          roomEnterBehavior,
        })}`
      )
        .then((res) => res.json())
        .then((room) => history.push(`/room/${room.name}`));
    }
  }, [userId, history, capacity, roomEnterBehavior]);

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
      <div className={classes.box}>
        <input
          type="radio"
          value={RoomBehavior.USER_SPECTATE}
          id={RoomBehavior.USER_SPECTATE}
          onChange={() => setEnterBehavior(RoomBehavior.USER_SPECTATE)}
          name="gender"
        />
        <label htmlFor={RoomBehavior.USER_SPECTATE}>
          Users choose to spectate
        </label>
        <input
          type="radio"
          value={RoomBehavior.MOD_SPECTATE}
          id={RoomBehavior.MOD_SPECTATE}
          onChange={() => setEnterBehavior(RoomBehavior.MOD_SPECTATE)}
          name="gender"
        />
        <label htmlFor={RoomBehavior.MOD_SPECTATE}>
          Moderator manages spectators
        </label>
      </div>
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
