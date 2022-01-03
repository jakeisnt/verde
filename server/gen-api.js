import fs from "fs";
import { clientConfig } from "./index.js";

/* Script to provide the server's websocket API to the client.
 * If this does not update, try deleting the client's api schema.
 */
function writeJSON(path, obj) {
  fs.writeFile(path, JSON.stringify(obj, null, 2), (err) => {
    if (err) {
      throw err;
    }
  });
}

writeJSON("./api_schema.json", clientConfig);
