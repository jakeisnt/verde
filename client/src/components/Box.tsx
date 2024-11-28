import { ReactNode } from "react";
import useStyles from "./styles";

/** A basic box. The backbone of the appearance of the site. */
function Box({
  error,
  text,
  children,
}: {
  error?: string;
  text?: string;
  children?: ReactNode;
}) {
  const classes = useStyles(error);
  return (
    <div className={error ? classes.errorBox : classes.box}>
      {error || text}
      {children}
    </div>
  );
}

export default Box;
