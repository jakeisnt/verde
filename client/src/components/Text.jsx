import PropTypes from "./prop-types";

function Text({ children }) {
  return <p>{children}</p>;
}

Text.propTypes = {
  children: PropTypes.children.isRequired,
};

export default Text;
