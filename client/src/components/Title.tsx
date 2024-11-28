import { ReactNode } from "react";
import useStyles from "./styles";

/* A Title component. Use this instead of a <h1/> or <h2/>
 * as it's much easier to style the website from a single source of truth.
 */
function Title({ children }: { children: ReactNode }) {
  const classes = useStyles();
  return <h1 className={classes.title}>{children}</h1>;
}

export default Title;
