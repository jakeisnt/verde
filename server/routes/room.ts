import express, { type Router, type Request, type Response } from "express";
import Rooms from "../engine/rooms";

const router: Router = express.Router();

/** Provide functions to create and access information about rooms. */

/* GET new room. */
router.get(
  "/new",
  (
    req: Request<{}, {}, {}, { capacity?: string; userId?: string }>,
    res: Response
  ) => {
    const capacity = parseInt((req.query.capacity as string) || "-1", 10);
    res.json(Rooms.createRoom(req.query.userId as string, capacity));
  }
);

/* GET existing room. */
router.get(
  "/get",
  (req: Request<{}, {}, {}, { name?: string }>, res: Response) => {
    const room = Rooms.getRoom(req.query.name as string);
    if (room) return res.json(room);
    return res.status(404).send(`Room ${req.query.name} not found`);
  }
);

export default router;
