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
  try {
    res.json(users.getUser(req.query.id));
  } catch (error) {
    res.status(404).send(error.message);
  }
});

/* PUT user name. */
router.put("/setName", (req, res, next) => {
  try {
    res.json(users.setName(req.query.id, req.query.name));
  } catch (error) {
    res.status(404).send(error.message);
  }
});

module.exports = router;
