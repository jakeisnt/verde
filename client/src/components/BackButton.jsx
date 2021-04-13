import { useHistory } from "react-router-dom";
import PropTypes from "./prop-types";
import useStyles from "./styles";

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
