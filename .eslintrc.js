module.exports = {
  extends: ["airbnb", "airbnb/hooks", "eslint-config-prettier"],
  plugins: ["prettier"],
  root: true,
  rules: {
    "prettier/prettier": [
      "error",
      {
        singleQuote: false,
        printWidth: 80,
        endOfLine: "auto",
      },
    ],
    // incompatible with prettier
    "react/jsx-curly-newline": "off",
    "react/jsx-indent": "off",
    "react/jsx-wrap-multilines": "off",
    "react/jsx-closing-tag-location": "off",
    "react/no-array-index-key": "warn",
    "@typescript-eslint/indent": "off",
    "no-unused-vars": "warn",
    "react/button-has-type": "warn",

    // personal preference
    "react/jsx-props-no-spreading": "off",

    // react 17 doesn't need to import it : )
    "react/react-in-jsx-scope": "off",
  },
};
