/** Converts the classes to APIs for use here and externally. */

import Users from "./users";
import Game from "./games.ts";
import Connect from "./connect";
import { getParamNames, getFuncsOfClass } from "./utils";

/**
 * Converts a class to an API.
 */
function classToAPI(clss: any) {
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
