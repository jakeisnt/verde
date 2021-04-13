const { override, useBabelRc, addBabelPlugins } = require("customize-cra");

module.exports = override(
  useBabelRc(),
  addBabelPlugins(
    "@babel/plugin-syntax-class-properties",
    "@babel/plugin-proposal-class-properties"
  )
);
