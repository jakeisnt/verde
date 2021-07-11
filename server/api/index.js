/** Converts the classes to APIs for use here and externally. */

import Users from "./users";
import Game from "./games";
import Connect from "./connect";
import { getParamNames, getFuncsOfClass } from "./utils";

function classToAPI(clss) {
  return getFuncsOfClass(clss).reduce((acc, funcName) => {
    return {
      ...acc,
      [funcName]: getParamNames(clss[funcName])[2] || [],
    };
  }, {});
}

const classes = {
  users: Users,
  game: Game,
  connect_disconnect: Connect,
};

const spec = Object.keys(classes).reduce(
  (curSpec, nextKey) => ({
    ...curSpec,
    [nextKey]: classToAPI(classes[nextKey]),
  }),
  {}
);

export { spec, classes };
