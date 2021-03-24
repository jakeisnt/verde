import { useHistory } from "react-router-dom";
import { createUseStyles, useTheme } from "react-jss";

const useStyles = createUseStyles((theme) => ({
  home: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    maxWidth: "50%",
    margin: "auto",
  },
  button: {
    padding: "1em",
    margin: "1em",
    border: `2px solid ${theme.black}`,
    color: theme.black,
    backgroundColor: theme.white,
  },
}));

function Home() {
  const history = useHistory();
  const classes = useStyles();

  const getNewRoom = () =>
    fetch("/room/new")
      .then((res) => res.json())
      .then((res) => history.push(`/room/${res.name}`));

  return (
    <div className={classes.home}>
      <button type="button" className={classes.button} onClick={getNewRoom}>
        Create Room
      </button>
      <button
        type="button"
        className={classes.button}
        onClick={() => history.push("/join")}
      >
        Join Room
      </button>
    </div>
  );
}

export default Home;
