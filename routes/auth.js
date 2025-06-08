const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const validate = require("../middleware/validate");
const express = require("express");
const router = express.Router();
const Joi = require("joi");

router.post("/", validate(validateAuth), async (req, res) => {
  let { email, password } = req.body;

  let user = await User.findOne({ email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  const token = user.generateAuthToken();
  res.status(200).send(token);
});

function validateAuth(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(1024).required(),
  });
  return schema.validate(req);
}

module.exports = router;
