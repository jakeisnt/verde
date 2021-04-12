import { useHistory } from "react-router-dom";
import { createUseStyles } from "react-jss";
import PropTypes from "prop-types";

const useStyles = createUseStyles((theme) => ({
  button: {
    padding: "1em",
    margin: "1em",
    textAlign: "center",
    border: `2px solid ${theme.black}`,
    color: theme.black,
    backgroundColor: theme.white,
  },
}));

function Button({ onClick, title }) {
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

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default Button;
