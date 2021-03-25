const express = require("express");
const rooms = require("../engine/rooms");

const router = express.Router();

/* GET new room. */
router.get("/new", (req, res, next) => {
  res.json(rooms.createRoom(req.query.userId));
});

/* GET existing room. */
router.get("/get", (req, res, next) => {
  const room = rooms.getRoom(req.query.name);
  if (room === null) {
    res.status(404).send("Room not found");
  } else {
    res.json(room);
  }
});

/* PUT user into room. */
router.put("/join", (req, res, next) => {
  const room = rooms.joinRoom(req.query.name, req.query.userId);
  if (room === null) {
    res.status(404).send("Room not found");
  } else {
    res.json(room);
  }
});

module.exports = router;
