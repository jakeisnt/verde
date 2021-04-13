const fs = require("fs");
const { clientConfig, serverConfig } = require("./server/index.js");

function writeJSON(path, obj) {
  // fs.stat(path, (err) =>
  //   err === null ? fs.unlinkSync(path) : console.log(err)
  // );

  fs.writeFile(path, JSON.stringify(obj, null, 2), (err) => {
    if (err) {
      throw err;
    }
  });
}

// writeJSON("./server/api_schema.json", serverConfig);
writeJSON("./client/src/api_schema.json", clientConfig);
