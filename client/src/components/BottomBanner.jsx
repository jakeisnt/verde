import PropTypes from "./prop-types";
import useStyles from "./styles";
import Text from "./Text";
import Button from "./Button";
import { useToggle } from "../context";

/** A bottom banner displayed on the site. */
function BottomBanner({ text, children }) {
  const classes = useStyles();
  const [closed, toggleClosed] = useToggle(false);

  return closed ? null : (
    <div className={classes.bottomBanner}>
      <Text> {text} </Text>
      {children}
      <Button title="Ok." onClick={toggleClosed} />
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
