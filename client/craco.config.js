// craco.config.js
// https://stackoverflow.com/questions/65447779/yarn-workspaces-workspace-does-not-emit-errors-or-warnings
const path = require("path");
const fs = require("fs");
const { getLoader, loaderByName } = require("@craco/craco");
const { getPlugin, pluginByName } = require("@craco/craco/lib/webpack-plugins");

const absolutePath = path.join(__dirname, "./");
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const rewireBabelLoader = require("craco-babel-loader");
module.exports = {
  plugins: [
    //This is a craco plugin: https://github.com/sharegate/craco/blob/master/packages/craco/README.md#configuration-overview
    {
      plugin: rewireBabelLoader,
      options: {
        includes: [resolveApp("../server")], //put things you want to include in array here
        excludes: [/(node_modules|bower_components)/], //things you want to exclude here
        //you can omit include or exclude if you only want to use one option
      },
    },
  ],
  babel: {
    presets: ["@babel/preset-react"],
    plugins: [
      "@babel/plugin-syntax-class-properties",
      "@babel/plugin-proposal-class-properties",
    ],
  },
};
