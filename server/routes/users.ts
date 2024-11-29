import express, { type Router, type Request, type Response } from "express";
import Users from "../engine/users";

const router = express.Router();

/** Provide HTTP functionality for creating, fetching and renaming users. */

/* GET new user. */
router.get("/new", (_req: Request, res: Response) => {
  res.json(Users.createUser());
});

/* GET existing user. */
router.get("/get", (req: any, res: any) => {
  const user = Users.getUser(req.query.id as string);
  if (user) return res.json(user);
  return res.status(404).send(`User ${req.query.id} not found`);
});

/* PUT user name. */
router.put("/setName", (req: any, res: any) => {
  const user = Users.setName(req.query.id as string, req.query.name as string);
  if (user) return res.json(user);
  return res.status(404).send(`User ${req.query.id} not found`);
});

export default router;
