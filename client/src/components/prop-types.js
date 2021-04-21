import PropTypes from "prop-types";

/* Abbreviated types for PropTypes. */
PropTypes.children = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.node),
  PropTypes.node,
]);

export default PropTypes;
