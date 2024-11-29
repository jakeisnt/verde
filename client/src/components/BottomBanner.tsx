import useStyles from "./styles";
import Text from "./Text";
import Button from "./Button";
import { useToggle } from "../context";
import { ReactNode } from "react";

type BottomBannerProps = {
  text: string;
  children?: ReactNode;
}

/** A bottom banner displayed on the site. */
function BottomBanner({ text, children }: BottomBannerProps) {
  const classes = useStyles();
  const [closed, toggleClosed] = useToggle(false);

  return closed ? null : (
    <div className={classes.bottomBanner}>
      <Text> {text} </Text>
      {children}
      <Button title="Ok." onClick={() => toggleClosed()} />
    </div>
  );
}

export default BottomBanner;
