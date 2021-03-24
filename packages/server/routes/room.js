const express = require("express");
const rooms = require("../engine/rooms");

const router = express.Router();

/* GET new room. */
router.get("/new", (req, res, next) => {
  res.json(rooms.createRoom());
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

module.exports = router;
