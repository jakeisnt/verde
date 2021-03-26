import { useHistory } from "react-router-dom";
import { createUseStyles } from "react-jss";
import PropTypes from "prop-types";

const useStyles = createUseStyles((theme) => ({
  backButton: {
    border: "none",
    backgroundColor: theme.white,
    color: theme.black,
    textAlign: "left",
  },
}));

function BackButton({ text }) {
  const history = useHistory();
  const classes = useStyles();

  return (
    <button
      type="button"
      className={classes.backButton}
      onClick={() => history.push(`/`)}
    >
      {`↩ ${text}`}
    </button>
  );
}

BackButton.propTypes = {
  text: PropTypes.string,
};

BackButton.defaultProps = {
  text: "Back",
};

export default BackButton;
