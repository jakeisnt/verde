/** This file contains logic used to parse the games/ and users/ api files
 * to provide the client with callable functions for the websockets. */

const STRIP_COMMENTS =
  /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/gm;
const ARGUMENT_NAMES = /([^\s,]+)/g;

// get the names of parameters provided to a function.
function getParamNames(func: Function): string[] {
  const fnStr = func.toString().replace(STRIP_COMMENTS, "");
  let result = Array.from(
    fnStr
      .slice(fnStr.indexOf("(") + 1, fnStr.indexOf(")"))
      .match(ARGUMENT_NAMES) || []
  );

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

function getFuncsOfClass(clss: any): string[] {
  return Object.getOwnPropertyNames(clss).filter(
    (e) => typeof clss[e] === "function"
  );
}

export { getParamNames, getFuncsOfClass };
