import { useState } from "react";
import { useHistory } from "react-router-dom";
import useStyles from "./styles";

function Join() {
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const history = useHistory();
  const classes = useStyles();

  const joinLobby = () =>
    fetch(`/room/get?${new URLSearchParams({ name })}`)
      .then((res) => res.json())
      .then((res) => history.push(`/room/${res.name}`))
      .then(() => setError(""))
      .catch(() => setError(`room "${name}" does not exist`));

  return (
    <div className={classes.home}>
      <input
        type="text"
        className={classes.box}
        value={name}
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
