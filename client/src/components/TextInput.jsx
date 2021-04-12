import { createUseStyles } from "react-jss";

const useStyles = createUseStyles((theme) => ({
  backButton: {
    border: "none",
    backgroundColor: theme.white,
    color: theme.black,
    textAlign: "left",
  },
}));

function TextInput({ value, placeholder, onKeyUp, onInput }) {
  const classes = useStyles();
  return (
    <input
      type="text"
      className={classes.box}
      value={value}
      placeholder={placeholder}
      onKeyUp={onKeyUp}
      onInput={onInput}
    />
  );
}

export default TextInput;
