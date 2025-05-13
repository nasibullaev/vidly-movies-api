const { User, validate } = require("..models/users");
const Joi = require("joi");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  user = await user.save();
  res.send(user);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    },
    { new: true }
  );
  if (!user) return res.status(404).send("User not found");
  res.send(user);
});

router.delete("/:id", async (req, res) => {
  const user = User.findByIdAndRemove(req.params.id);
  if (!user) return res.status(404).send("User not found with given id");
  res.send(user);
});

router.get("/:id", async (req, res) => {
  const user = User.findById(req.params.id);
  if (!user) return res.status(404).send("User not found with given Id");
  res.send(user);
});
