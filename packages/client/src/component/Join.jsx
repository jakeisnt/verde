import { useState } from "react";
import { useHistory } from "react-router-dom";

function Join() {
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const history = useHistory();

  const joinLobby = () =>
    fetch(`http://localhost:4000/room/get?${new URLSearchParams({ name })}`)
      .then((res) => res.json())
      .then((res) => history.push(`/room/${res.name}`))
      .then(() => setError(""))
      .catch(() => setError(`room "${name}" does not exist`));

  return (
    <div className="Home">
      <input
        type="text"
        value={name}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            joinLobby();
          }
        }}
        onInput={(e) => setName(e.target.value.toUpperCase())}
      />
      <br />
      <button type="button" onClick={joinLobby}>
        Join Lobby
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}

export default Join;
