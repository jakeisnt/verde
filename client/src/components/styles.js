import { createUseStyles } from "react-jss";

/** Styles shared by various components. */

const useStyles = createUseStyles((theme) => ({
  backButton: {
    border: "none",
    backgroundColor: theme.white,
    color: theme.black,
    textAlign: "left",
  },
  box: {
    padding: "1em",
    margin: "1em",
    textAlign: "center",
    border: `2px solid ${theme.black}`,
    color: theme.black,
    backgroundColor: theme.white,
  },
  errorBox: {
    padding: "1em",
    margin: "1em",
    textAlign: "center",
    border: `2px solid ${theme.red}`,
    color: theme.black,
    backgroundColor: theme.white,
  },
  page: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    maxWidth: "50%",
    margin: "auto",
    marginTop: "2em",
  },
  textInput: {
    border: "none",
    backgroundColor: theme.white,
    color: theme.black,
    textAlign: "left",
  },
  bottomBanner: {
    display: "flex",
    jusifyContent: "space-between",
    bottom: "3em",
    left: "3em",
    position: "absolute",
    verticalAlign: "center",
    border: `3px solid ${theme.black}`,
    color: theme.black,
    backgroundColor: theme.white,
  },
}));

export default useStyles;
