const express = require("express");
const users = require("../engine/users");

const router = express.Router();

/* GET users listing. */
router.get("/", (req, res) => {
  res.send("respond with a resource");
});

/* GET new user. */
router.get("/new", (req, res, next) => {
  res.json(users.createUser());
});

/* GET existing user. */
router.get("/get", (req, res, next) => {
  const user = users.getUser(req.query.id);
  if (user === null) {
    res.status(404).send("user not found");
  } else {
    res.json(user);
  }
});

/* PUT user name. */
router.put("/setName", (req, res, next) => {
  const user = users.setName(req.query.id, req.query.name);
  if (user === null) {
    res.status(404).send("user not found");
  } else {
    res.json(user);
  }
});

module.exports = router;
