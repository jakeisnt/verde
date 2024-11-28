import BackButton from "./BackButton";
import useStyles from "./styles";
import { ReactNode } from "react";

/** A Page component used to declare different pages of the website. */
function Page({
  backButtonName,
  children,
}: {
  backButtonName?: string;
  children: ReactNode;
}) {
  const classes = useStyles();

  return (
    <div className={classes.page}>
      <BackButton text={backButtonName} />
      {children}
    </div>
  );
}

export default Page;
