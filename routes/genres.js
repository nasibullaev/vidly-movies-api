const validateObjectId = require("../middleware/validateObjectId");
require("express-async-errors");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validate = require("../middleware/validate");
const { Genre, validateGenre } = require("../models/genre");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.status(200).send(genres);
});

router.post("/", [auth, validate(validateGenre)], async (req, res) => {
  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();

  res.send(genre);
});

router.put("/:id", [auth, validate(validateGenre)], async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send("Invalid ID");

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    {
      new: true,
    }
  );

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.status(200).send(genre);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send("Invalid ID");
  const genre = await Genre.findByIdAndDelete(req.params.id);

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

module.exports = router;
