import { useHistory } from "react-router-dom";
import useStyles from "./styles";

function Home() {
  const history = useHistory();
  const classes = useStyles();

  const getNewRoom = () =>
    fetch("/room/new")
      .then((res) => res.json())
      .then((res) => history.push(`/room/${res.name}`));

  return (
    <div className={classes.home}>
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
