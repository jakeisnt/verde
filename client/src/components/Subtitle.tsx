import { ReactNode } from "react";
import useStyles from "./styles";

/** A Subtitle component. Use this instead of a <p/> or <h4/>
 * as it's much easier to style the website from a single source of truth.
 */

function Subtitle({ children }: { children: ReactNode }) {
  const classes = useStyles();
  return <p className={classes.subtitle}>{children}</p>;
}

export default Subtitle;
