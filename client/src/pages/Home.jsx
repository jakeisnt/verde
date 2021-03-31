import { useHistory, useParams } from "react-router-dom";
import useStyles from "./styles";

function Home() {
  const history = useHistory();
  const { error } = useParams();
  const classes = useStyles();

  return (
    <div className={classes.home}>
      {error && (
        <div className={classes.errorBox}>{decodeURIComponent(error)}</div>
      )}
      <h1 className={classes.title}>Fun Game</h1>
      <img alt="add logo here" className={classes.fakePic} />
      <button
        type="button"
        className={classes.box}
        onClick={() => history.push("/create")}
      >
        Create Room
      </button>
      <button
        type="button"
        className={classes.box}
        onClick={() => history.push("/join")}
      >
        Join Room
      </button>
      <button
        type="button"
        className={classes.box}
        onClick={() => history.push("/profile")}
      >
        Profile
      </button>
      <button
        type="button"
        className={classes.box}
        onClick={() => history.push("/about")}
      >
        About
      </button>
    </div>
  );
}

export default Home;
