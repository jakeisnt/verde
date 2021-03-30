import { useState } from "react";
import { useHistory } from "react-router-dom";
import useStyles from "./styles";

import BackButton from "../components/BackButton";

function Join() {
  const [name, setName] = useState("");
  const history = useHistory();
  const classes = useStyles();

  return (
    <div className={classes.home}>
      <BackButton />
      <input
        type="text"
        className={classes.box}
        value={name}
        placeholder="Enter a room ID"
        onKeyUp={(e) => e.key === "Enter" && history.push(`/room/${name}`)}
        onInput={(e) => setName(e.target.value.toUpperCase())}
      />
      <button
        type="button"
        className={classes.box}
        onClick={() => history.push(`/room/${name}`)}
      >
        Join Lobby
      </button>
    </div>
  );
}

export default Join;
