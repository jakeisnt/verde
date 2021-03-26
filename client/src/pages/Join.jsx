import { useState } from "react";
import { useHistory } from "react-router-dom";
import useStyles from "./styles";

function Join() {
  const [name, setName] = useState("");
  const history = useHistory();
  const classes = useStyles();

  return <div className={classes.home}>This is an about page.</div>;
}

export default Join;
