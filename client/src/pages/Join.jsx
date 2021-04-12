import { useState } from "react";
import { useHistory } from "react-router-dom";
import useStyles from "./styles";

import BackButton from "../components/BackButton";
import Button from "../components/Button";

function Join() {
  const [name, setName] = useState("");
  const history = useHistory();
  const classes = useStyles();

  return (
    <div className={classes.page}>
      <BackButton />
      <input
        type="text"
        className={classes.box}
        value={name}
        placeholder="Enter a room ID"
        onKeyUp={(e) => e.key === "Enter" && history.push(`/room/${name}`)}
        onInput={(e) => setName(e.target.value.toUpperCase())}
      />
      <Button
        title="Join Lobby"
        onClick={() => history.push(`/room/${name}`)}
      />
    </div>
  );
}

export default Join;
