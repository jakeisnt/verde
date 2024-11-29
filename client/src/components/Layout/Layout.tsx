import { createUseStyles } from "react-jss";
import { Theme } from "../../theme/theme";
import { Outlet } from "react-router-dom";
import WSConnectionStatus from "../WSConnectionStatus";

const useStyles = createUseStyles((theme: Theme) => ({
  root: {
    minHeight: "100vh",
    backgroundColor: theme.colors.background.default,
  },
  header: {
    padding: theme.spacing(4),
    backgroundColor: theme.colors.background.paper,
    borderBottom: `1px solid ${theme.colors.divider}`,
    position: "sticky",
    top: 0,
    zIndex: 10,
    boxShadow: theme.shadows.sm,
  },
  headerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  main: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: theme.spacing(4),
    flex: 1,
  },
  logo: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight,
    color: theme.colors.primary.main,
    textDecoration: "none",
  },
}));

export const Layout = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <header className={classes.header}>
        <div className={classes.headerContent}>
          <a href="/" className={classes.logo}>
            Verde
          </a>
          <WSConnectionStatus />
        </div>
      </header>
      <main className={classes.main}>
        <Outlet />
      </main>
    </div>
  );
};
