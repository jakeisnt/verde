module.exports = {
  extends: ['airbnb', 'eslint-config-prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        printWidth: 80,
        arrowParens: 'avoid',
        trailingComma: 'all',
        endOfLine: 'auto',
      },
    ],
    // incompatible with prettier
    'react/jsx-curly-newline': 'off',
    'react/jsx-indent': 'off',
    'react/jsx-wrap-multilines': 'off',
    'react/jsx-closing-tag-location': 'off',
    'react/no-array-index-key': 'warn',
    '@typescript-eslint/indent': 'off',

    // personal preference
    'react/jsx-props-no-spreading': 'off',
  },
};
