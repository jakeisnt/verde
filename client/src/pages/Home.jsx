import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import useStyles from "./styles";
import { Button } from "../components";

/** This is the homepage of the application - providing links to available user actions. */
function Home() {
  const navigate = useNavigate();
  const { error } = useParams();
  const classes = useStyles();

  return (
    <div className={classes.home}>
      {error && (
        <div className={classes.errorBox}>{decodeURIComponent(error)}</div>
      )}
      <h1 className={classes.title}>Verde</h1>
      <img alt="add logo here" className={classes.fakePic} />
      <Button title="Create Room" onClick={() => navigate("/create")} />
      <Button title="Join Room" onClick={() => navigate("/join")} />
      <Button title="Profile" onClick={() => navigate("/profile")} />
      <Button title="About" onClick={() => navigate("/about")} />
    </div>
  );
}

export default Home;
