const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

// Get all users
router.get("/", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

// Create a user
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { name, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) return res.status(400).send("User already registered");
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  user = new User({ name, email, password });

  await user.save();
  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send(_.pick(user, ["name", "email"]));
});

// Edit user details
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, email, password } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, password },
    { new: true }
  );

  if (!user) return res.status(404).send("User not found");
  res.send(_.pick(user, ["name", "email"]));
});

// Delete a user
router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).send("User not found with given id");
  res.send(user);
});

// Get one specific user
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid user ID");
  }

  const user = await User.findById(id);
  if (!user) return res.status(404).send("User not found");

  res.send(_.pick(user, ["name", "email"]));
});

module.exports = router;
