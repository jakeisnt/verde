const express = require("express");
const rooms = require("../engine/rooms");

const router = express.Router();

/* GET new room. */
router.get("/new", (req, res, next) => {
  res.json(rooms.createRoom(req.query.username));
});

/* GET current room. */
router.get("/get", (req, res, next) => {
  const room = rooms.getRoom(req.query.name);
  if (room === null) {
    res.status(404).send("room not found");
  } else {
    res.json(room);
  }
});

/* JOIN current room. */
router.get("/join", (req, res, next) => {
  const room = rooms.addUserToRoom(req.query.username, req.query.name);
  if (room === null) {
    res.status(404).send("Room not found");
  } else {
    res.json(room);
  }
});

module.exports = router;
