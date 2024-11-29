import { createUseStyles } from "react-jss";
import { Theme } from "../../../theme/theme";

export default createUseStyles<string, {}, Theme>((theme) => ({
  flexRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  changeUserBox: {
    display: "flex",
    flexDirection: "row",
    margin: "auto",
  },
  smallBox: {
    border: `2px solid ${theme.colors.divider}`,
    padding: "0.5em 0.5em",
    textAlign: "center",
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.paper,
  },
  banButton: {
    border: `2px solid ${theme.colors.error.main}`,
    padding: "auto",
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.paper,
  },
  userSaveButton: {
    border: `2px solid ${theme.colors.divider}`,
    padding: "auto",
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.paper,
    marginLeft: "0.5em",
    paddingTop: "0.5em",
    paddingBottom: "0.5em",
  },
  addButton: {
    border: `2px solid ${theme.colors.success.main}`,
    padding: "auto",
    backgroundColor: theme.colors.background.paper,
  },
}));
