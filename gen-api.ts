import fs from "fs";
import { clientConfig } from "./server";

/*
 * Script to provide the server's websocket API to the client.
 * If this does not update, try deleting the client's api schema.
 */
function writeJSON(path: string, obj: any): void {
  fs.writeFile(
    path,
    JSON.stringify(obj, null, 2),
    (err: NodeJS.ErrnoException | null) => {
      if (err) {
        throw err;
      }
    }
  );
}

writeJSON("./client/src/api_schema.json", clientConfig);
