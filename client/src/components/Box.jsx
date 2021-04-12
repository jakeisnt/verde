import useStyles from "./styles";

function Box({ error, text }) {
  const classes = useStyles(error);
  return <div className={classes.box}>{error || text} </div>;
}

export default Box;
