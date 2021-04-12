import { createUseStyles } from "react-jss";
import BackButton from "./BackButton";

const useStyles = createUseStyles((theme) => ({
  page: {
    border: "none",
    backgroundColor: theme.white,
    color: theme.black,
    textAlign: "left",
  },
}));

function Page({ backButtonName, children }) {
  const classes = useStyles();
  return (
    <div className={classes.page}>
      <BackButton text={backButtonName} />
      {children}
    </div>
  );
}

export default Page;
