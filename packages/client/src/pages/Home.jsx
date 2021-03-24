import { useHistory } from "react-router-dom";
import { createUseStyles, useTheme } from "react-jss";

const useStyles = createUseStyles({
  home: {
    display: "flex",
    flexDirection: "row",
  },
});

function Home() {
  const history = useHistory();
  const classes = useStyles();

  const getNewRoom = () =>
    fetch("/room/new")
      .then((res) => res.json())
      .then((res) => history.push(`/room/${res.name}`));

  return (
    <div className={classes.home}>
      <button type="button" onClick={getNewRoom}>
        Create Room
      </button>
      <button type="button" onClick={() => history.push("/join")}>
        Join Room
      </button>
    </div>
  );
}

export default Home;
