const express = require("express");
const router = express.Router();
const { Rental } = require("../models/rental");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  if (!req.body.customerId || !req.body.movieId)
    return res.status(400).send("CustomerId or MovieId is not provided");

  const rental = await Rental.findOne({
    "customer._id": req.body.customerId,
    "movie._id": req.body.movieId,
  });
  if (!rental)
    return res.status(404).send("No rental found for this customer/movie");
  if (rental.dateReturned)
    return res.status(400).send("Rental already processed");
});

module.exports = router;
