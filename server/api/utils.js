var STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/gm;
var ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(func) {
  var fnStr = func.toString().replace(STRIP_COMMENTS, "");
  var result = fnStr
    .slice(fnStr.indexOf("(") + 1, fnStr.indexOf(")"))
    .match(ARGUMENT_NAMES);
  if (result === null) result = [];

  // Converts parameters of object destructors to arrays of strings.
  // NOTE:  Does not work for nested destructors yet.
  while (result.indexOf("{") !== -1) {
    const objStart = result.indexOf("{");
    const objEnd = result.indexOf("}");
    const slice = result.slice(objStart + 1, objEnd);
    result.splice(objStart, objEnd - objStart);
    result[objStart] = slice;
  }
  return result;
}

// const DEFAULT_CLASS_PROPS = ["length", "prototype", "name"];
// (propName) => !(propName in DEFAULT_CLASS_PROPS)
function getFuncsOfClass(clss) {
  return Object.getOwnPropertyNames(clss).filter(
    (e) => typeof clss[e] == "function"
  );
}

module.exports = { getParamNames, getFuncsOfClass };
