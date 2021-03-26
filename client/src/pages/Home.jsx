import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useUser } from "../context/userContext";
import useStyles from "./styles";

function Home() {
  const { user } = useUser();
  const history = useHistory();
  const classes = useStyles();

  const createRoom = useCallback(
    () =>
      user &&
      fetch(`/room/new?${new URLSearchParams({ userId: user.id })}`)
        .then((res) => res.json())
        .then((room) => history.push(`/room/${room.name}`)),
    [user, history]
  );

  return (
    <div className={classes.home}>
      <button type="button" className={classes.box} onClick={createRoom}>
        Create Room
      </button>
      <button
        type="button"
        className={classes.box}
        onClick={() => history.push("/join")}
      >
        Join Room
      </button>
      <button
        type="button"
        className={classes.box}
        onClick={() => history.push("/profile")}
      >
        Profile
      </button>
    </div>
  );
}

export default Home;
