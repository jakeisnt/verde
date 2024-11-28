import { useNavigate } from "react-router-dom";
import PropTypes from "./prop-types";
import useStyles from "./styles";

/** A text-based back button that navigates through the website's history. */
function BackButton({ text }) {
  const navigate = useNavigate();
  const classes = useStyles();

  return (
    <button
      type="button"
      className={classes.backButton}
      onClick={() => navigate(`/`)}
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
