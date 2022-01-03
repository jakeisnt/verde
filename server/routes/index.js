import express from "express";
import path from "path";

const router = express.Router();
const dirname = path.join(process.cwd(), "/build"); // build";
// const dirname = "./routes";

/** Provides routes to access the home page of the application.
 * As the routing to different pages is primarily handled by the client side, there isn't much here.
 * */

/* GET home page. */
router.get("/", (req, res) => {
  res.sendFile(path.join(dirname, "/index.html"));
});

export default router;
