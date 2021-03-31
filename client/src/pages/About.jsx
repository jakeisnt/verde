import useStyles from "./styles";
import BackButton from "../components/BackButton";

function About() {
  const classes = useStyles();

  return (
    <div className={classes.about}>
      <BackButton />
      <h1>About</h1>
      <p>
        This is a sample about page. It has some information about the creators
        of this game.
      </p>
      <p>
        You can find the source code to this repository{" "}
        <a
          href="https://github.com/jakeisnt/react-turn-based-game"
          target="_blank"
          rel="noreferrer"
        >
          here
        </a>
        . Feel free to open a pull request!
      </p>
    </div>
  );
}

export default About;
