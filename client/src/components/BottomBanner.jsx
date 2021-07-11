import PropTypes from "./prop-types";
import useStyles from "./styles";
import Title from "./Subtitle";
import Button from "./Button";
import { useToggle } from "../context";

/** A bottom banner displayed on the site. */
function BottomBanner({ text, children }) {
  const classes = useStyles();
  const [closed, toggleClosed] = useToggle(false);

  return closed ? null : (
    <div className={classes.bottomBanner}>
      <Title>
        {text}
      </Title>
      {children}
      <Button title="ok" onClick={toggleClosed} />
    </div>
  );
}

BottomBanner.propTypes = {
  text: PropTypes.string.isRequired,
  children: PropTypes.children,
};

BottomBanner.defaultProps = {
  children: undefined,
};

export default BottomBanner;
