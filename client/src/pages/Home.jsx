import { useState } from "react";
import { useHistory } from "react-router-dom";
import useStyles from "./styles";

function Home() {
  const [username, setUsername] = useState("");
  const history = useHistory();
  const classes = useStyles();

  const getNewRoom = () =>
    fetch(`/room/new?${new URLSearchParams({ username })}`)
      .then((res) => res.json())
      .then((res) => history.push(`/room/${res.name}/user/${username}`));

  return (
    <div className={classes.home}>
      <input
        type="text"
        className={classes.box}
        value={username}
        placeholder="Enter a username"
        onInput={(e) => setUsername(e.target.value)}
      />
      <button type="button" className={classes.box} onClick={getNewRoom}>
        Create Room
      </button>
      <button
        type="button"
        className={classes.box}
        onClick={() => history.push("/join")}
      >
        Join Room
      </button>
    </div>
  );
}

export default Home;
