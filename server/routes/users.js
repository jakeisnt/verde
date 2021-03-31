const express = require("express");
const Users = require("../engine/users");

const router = express.Router();

/* GET users listing. */
router.get("/", (req, res) => {
  res.send("respond with a resource");
});

/* GET new user. */
router.get("/new", (req, res, next) => {
  res.json(Users.createUser());
});

/* GET existing user. */
router.get("/get", (req, res, next) => {
  const user = Users.getUser(req.query.id);
  if (user) return res.json(user);
  res.status(404).send(`User ${req.query.id} not found`);
});

/* PUT user name. */
router.put("/setName", (req, res, next) => {
  const user = Users.setName(req.query.id, req.query.name);
  if (user) return res.json(user);
  res.status(404).send(`User ${req.query.id} not found`);
});

module.exports = router;
