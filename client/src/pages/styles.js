import { createUseStyles } from "react-jss";

export default createUseStyles((theme) => ({
  home: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    maxWidth: "50%",
    margin: "auto",
  },
  room: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    maxWidth: "50%",
    margin: "auto",
  },
  profile: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    maxWidth: "50%",
    margin: "auto",
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
    backgroundColor: theme.white,
  },
}));
