import useStyles from "./styles";

/** A basic button component. */
function Button({ onClick, title }: { onClick: () => void; title: string }) {
  const classes = useStyles();

  return (
    <button
      tabIndex={0}
      type="button"
      className={classes.button}
      onClick={onClick}
    >
      {title}
    </button>
  );
}

export default Button;
