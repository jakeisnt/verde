const express = require("express");
const rooms = require("../engine/rooms");

const router = express.Router();

/* GET new room. */
router.get("/new", (req, res, next) => {
  res.json(rooms.createRoom(req.query.userId));
});

/* GET current room. */
router.get("/get", (req, res, next) => {
  const room = rooms.getRoom(req.query.name);
  if (room === null) {
    res.status(404).send("Room not found");
  } else {
    res.json(room);
  }
});

/* JOIN current room. */
router.get("/join", (req, res, next) => {
  const room = rooms.addUserToRoom(req.query.name, req.query.userId);
  if (room === null) {
    res.status(404).send("Room not found");
  } else {
    res.json(room);
  }
});

module.exports = router;
