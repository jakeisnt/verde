const Users = require("./users");
const Game = require("./games");
const { getParamNames, getFuncsOfClass } = require("./utils");

function classToAPI(clss) {
  return getFuncsOfClass(clss).reduce((acc, funcName) => {
    return {
      ...acc,
      [funcName]: getParamNames(clss[funcName])[2] || [],
    };
  }, {});
}

const spec = {
  users: classToAPI(Users),
  game: classToAPI(Game),
};

const classes = {
  users: Users,
  game: Game,
};

module.exports = { spec, classes };
