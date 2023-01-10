import PropTypes from "./prop-types";
import useStyles from './styles';

/* A Subtitle component. Use this instead of a <p/> or <h4/>
 * as it's much easier to style the website from a single source of truth.
 */

function Subtitle({ children }) {
  const classes = useStyles();
  return <p className={classes.subtitle}>{children}</p>;
}

Subtitle.propTypes = {
  children: PropTypes.children.isRequired,
};

export default Subtitle;
