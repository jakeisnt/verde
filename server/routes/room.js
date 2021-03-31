const express = require("express");
const Rooms = require("../engine/rooms");

const router = express.Router();

/* GET new room. */
router.get("/new", (req, res) => {
  const capacity = parseInt(req.query.capacity || "-1");
  res.json(Rooms.createRoom(req.query.userId, capacity || -1));
});

/* GET existing room. */
router.get("/get", (req, res) => {
  const room = Rooms.getRoom(req.query.name);
  if (room) res.json(room);
  res.status(404).send(`Room ${req.query.name} not found`);
});

module.exports = router;
