import { useNavigate } from "react-router-dom";
import useStyles from "./styles";

/** A text-based back button that navigates through the website's history. */
function BackButton({ text = "Back" }: { text?: string }) {
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

export default BackButton;
