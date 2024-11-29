import { useState, useEffect } from "react";
import { ReadyState } from "react-use-websocket";
import { createUseStyles } from "react-jss";
import RippleLoader from "./RippleLoader";
import { useSocket } from "../context/socketContext";

import { Theme } from "../theme/theme";

/** Component that displays a status message if websocket connections aren't working out. */

enum Status {
  ERR = "error",
  WARN = "warn",
  OK = "ok",
}

interface StyleProps {
  status: Status;
}

const connectionStatus: Record<ReadyState, Status> = {
  [ReadyState.OPEN]: Status.OK,
  [ReadyState.CONNECTING]: Status.WARN,
  [ReadyState.CLOSING]: Status.WARN,
  [ReadyState.UNINSTANTIATED]: Status.WARN,
  [ReadyState.CLOSED]: Status.ERR,
};

const connStyles = createUseStyles<string, StyleProps, Theme>((theme) => ({
  connectionBanner: {},
  wsConnection: {
    display: "flex",
    position: "absolute",
    width: "100%",
    bottom: 0,
    zIndex: 999,
  },
  connMessage: {
    display: ({ status }) => (status === Status.ERR ? "block" : "none"),
    marginLeft: "3em",
    paddingTop: "1em",
  },
  connMessageWrapper: {
    flexGrow: 1,
  },
  closeButton: {
    border: "1px solid black",
    padding: "0.5em 1em",
    margin: "0.5em",
    backgroundColor: theme.colors.background.paper,
  },
  loadingSpinner: {
    marginRight: "2em",
    marginBottom: "2em",
    padding: "auto",
  },
}));

function WSConnectionStatus() {
  const socket = useSocket();
  const state = socket?.socketState ?? ReadyState.UNINSTANTIATED;
  const status = connectionStatus[state];
  const classes = connStyles({ status });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (status === Status.ERR) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [status]);

  return status === Status.OK ? null : (
    <>
      <div className={classes.wsConnection}>
        <div className={classes.connMessageWrapper}>
          {status === Status.ERR && open && (
            <div className={classes.connMessage}>
              You&apos;ve lost your connection and may have to rejoin.
            </div>
          )}
        </div>
        <div className={classes.loadingSpinner}>
          <RippleLoader />
        </div>
      </div>
    </>
  );
}

export default WSConnectionStatus;
