const express = require("express");
const Users = require("../engine/users");

const router = express.Router();

/* GET new user. */
router.get("/new", (req, res) => {
  res.json(Users.createUser());
});

/* GET existing user. */
router.get("/get", (req, res) => {
  const user = Users.getUser(req.query.id);
  if (user) return res.json(user);
  return res.status(404).send(`User ${req.query.id} not found`);
});

/* PUT user name. */
router.put("/setName", (req, res) => {
  const user = Users.setName(req.query.id, req.query.name);
  if (user) return res.json(user);
  return res.status(404).send(`User ${req.query.id} not found`);
});

module.exports = router;
