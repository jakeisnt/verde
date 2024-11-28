import express, { type Router, type Request, type Response } from "express";
import path from "path";

const router: Router = express.Router();
const dirname: string = path.join(process.cwd(), "/build"); // build";
// const dirname = "./routes";

/** Provides routes to access the home page of the application.
 * As the routing to different pages is primarily handled by the client side, there isn't much here.
 * */

/* GET home page. */
router.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(dirname, "/index.html"));
});

export default router;
