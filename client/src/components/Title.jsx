import PropTypes from "./prop-types";

function Title({ children }) {
  return <h1>{children}</h1>;
}

Title.propTypes = {
  children: PropTypes.children.isRequired,
};

export default Title;
