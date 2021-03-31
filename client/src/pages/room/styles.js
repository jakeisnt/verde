import { createUseStyles } from "react-jss";

export default createUseStyles((theme) => ({
  userBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  banButton: {
    border: `2px solid ${theme.red}`,
    padding: "auto",
    backgroundColor: theme.white,
  },
}));
