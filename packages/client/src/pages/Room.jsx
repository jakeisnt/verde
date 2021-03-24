import { useParams } from "react-router-dom";
import useStyles from "./styles";

function Room() {
  const { name } = useParams();
  const classes = useStyles();

  return (
    <div className={classes.room}>
      <div className={classes.box}>This is room {name}</div>
    </div>
  );
}

export default Room;
