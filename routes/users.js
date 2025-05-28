const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();

// get the current user
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.status(200).send(user);
});

// create a user
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

module.exports = router;
