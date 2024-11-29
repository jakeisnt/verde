import useStyles from "./styles";

/** A controlled Text Input component. */
function TextInput({
  value,
  placeholder,
  onKeyUp,
  onInput,
}: {
  value: string;
  placeholder: string;
  onKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
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
