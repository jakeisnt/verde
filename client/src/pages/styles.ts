import { createUseStyles } from "react-jss";
import { Theme } from "../theme/theme";

export default createUseStyles<string, {}, Theme>((theme) => ({
  home: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    maxWidth: "50%",
    margin: "auto",
    marginTop: "2em",
  },
  room: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    maxWidth: "50%",
    margin: "auto",
    marginTop: "2em",
  },
  box: {
    padding: "1em",
    margin: "1em",
    textAlign: "center",
    border: `2px solid ${theme.colors.divider}`,
    color: theme.colors.divider,
    backgroundColor: theme.colors.background.paper,
  },
  errorBox: {
    padding: "1em",
    margin: "1em",
    textAlign: "center",
    border: `2px solid ${theme.colors.error.main}`,
    backgroundColor: theme.colors.background.paper,
  },
  fakePic: {
    border: `2px solid ${theme.colors.divider}`,
    // width: "25vw",
    // height: "25vh",
    textAlign: "center",
    margin: "auto",
    marginBottom: "2em",
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));
