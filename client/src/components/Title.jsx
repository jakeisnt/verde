import PropTypes from "./prop-types";
import useStyles from './styles';

/* A Title component. Use this instead of a <h1/> or <h2/>
 * as it's much easier to style the website from a single source of truth.
 */
function Title({ children }) {
  const classes = useStyles();
  return <h1 className={classes.title}>{children}</h1>;
}

Title.propTypes = {
  children: PropTypes.children.isRequired,
};

export default Title;
