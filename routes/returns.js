const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  if (req.body.customerId) return res.status(401).send("Unathorized");
  return res.status(400).send("CustomerId is not provided");
});

module.exports = router;
