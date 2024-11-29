import { useNavigate, useParams } from "react-router-dom";
import useStyles from "./styles";
import { Title, Button } from "../components";

/**
 * The homepage of the application - providing links to available user actions.
 */
function Home() {
  const navigate = useNavigate();
  const { error } = useParams();
  const classes = useStyles();

  return (
    <>
      {error && (
        <div className={classes.errorBox}>{decodeURIComponent(error)}</div>
      )}
      <Title>Verde</Title>
      <div className={classes.home}>
        <img
          alt="Verde logo"
          width="200"
          height="200"
          className={classes.fakePic}
          src="../../mondrian.jpg"
        />
        <Button title="Create Room" onClick={() => navigate("/create")} />
        <Button title="Join Room" onClick={() => navigate("/join")} />
        <Button title="Profile" onClick={() => navigate("/profile")} />
        <Button title="About" onClick={() => navigate("/about")} />
      </div>
    </>
  );
}

export default Home;
