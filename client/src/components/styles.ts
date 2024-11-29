import { createUseStyles } from "react-jss";
import { Theme } from "../theme/theme";

/** Styles shared by various components. */

const useStyles = createUseStyles((theme: Theme) => ({
  backButton: {
    border: "none",
    backgroundColor: "rgba(0,0,0,0)",
    color: theme.colors.text.primary,
    textAlign: "left",
  },
  box: {
    padding: "1em",
    margin: "1em",
    textAlign: "center",
    border: `2px solid ${theme.colors.divider}`,
    color: theme.colors.divider,
    backgroundColor: theme.colors.background.paper,
  },
  title: {
    fontSize: "6em",
    color: theme.colors.divider,
    textAlign: "center",
    margin: "0.5em 0.5em",
    padding: 0,
    border: `1px solid ${theme.colors.divider}`,
  },
  subtitle: {
    fontSize: "2em",
  },
  button: {
    padding: "1em",
    margin: "1em",
    textAlign: "center",
    fontSize: "18px",
    border: `3px solid ${theme.colors.divider}`,
    color: theme.colors.divider,
    backgroundColor: theme.colors.background.paper,
    "&:hover": {
      border: `3px solid ${theme.colors.divider}`,
      boxShadow: "8px 8px black",
    },
    "&:focus": {
      border: `3px solid ${theme.colors.divider}`,
      boxShadow: "8px 8px black",
    },
    "&:active": {
      border: `3px solid ${theme.colors.divider}`,
      boxShadow: "8px 8px black",
    },
  },
  errorBox: {
    padding: "1em",
    margin: "1em",
    textAlign: "center",
    border: `2px solid ${theme.colors.error.main}`,
    color: theme.colors.error.main,
    backgroundColor: theme.colors.background.paper,
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
    backgroundColor: theme.colors.background.paper,
    color: theme.colors.divider,
    textAlign: "left",
  },
  bottomBanner: {
    display: "flex",
    jusifyContent: "space-between",
    bottom: "3em",
    left: "3em",
    position: "absolute",
    verticalAlign: "center",
    border: `4px solid ${theme.colors.divider}`,
    paddingLeft: "1em",
    color: theme.colors.divider,
    backgroundColor: theme.colors.background.paper,
  },
}));

export default useStyles;
