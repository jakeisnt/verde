const useStyles = createUseStyles((theme) => ({
  backButton: {
    border: "none",
    backgroundColor: theme.white,
    color: theme.black,
    textAlign: "left",
  },
  box: (error, small) => ({
    padding: small ? "0.5em" : "1em",
    margin: small ? 0 : "1em",
    textAlign: "center",
    border: `2px solid ${error ? theme.red : theme.black}`,
    color: theme.black,
    backgroundColor: theme.white,
  }),
}));
