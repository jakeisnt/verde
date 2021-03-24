import { useState } from "react";
import { useHistory } from "react-router-dom";
import useStyles from "./styles";

function Join() {
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const history = useHistory();
  const classes = useStyles();

  const joinLobby = () =>
    fetch(`/room/join?${new URLSearchParams({ name, username })}`)
      .then((res) => res.json())
      .then((res) => history.push(`/room/${res.name}`))
      .then(() => setError(""))
      .catch(() => setError(`Room "${name}" does not exist`));

  return (
    <div className={classes.home}>
      <input
        type="text"
        className={classes.box}
        value={username}
        placeholder="Enter a username"
        onInput={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        className={classes.box}
        value={name}
        placeholder="Enter a room ID"
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            joinLobby();
          }
        }}
        onInput={(e) => setName(e.target.value.toUpperCase())}
      />
      <button type="button" className={classes.box} onClick={joinLobby}>
        Join Lobby
      </button>
      {error && <div className={classes.errorBox}>{error}</div>}
    </div>
  );
}

export default Join;
