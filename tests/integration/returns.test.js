const request = require("supertest");
const { Rental } = require("../../models/rental");
const mongoose = require("mongoose");
const { result } = require("lodash");
describe("api/returns", () => {
  let server;
  let rental, customerId, movieId;
  beforeAll(async () => {
    server = require("../../index");
    customerId = new mongoose.Types.ObjectId();
    movieId = new mongoose.Types.ObjectId();
    rental = new Rental({
      customer: {
        _id: customerId,
        name: "12345",
        phone: "12345",
      },
      movie: {
        _id: movieId,
        title: "12345",
        dailyRentalRate: 2,
      },
    });
    await rental.save();
  });
  afterAll(async () => {
    await server.close();
    await Rental.deleteMany({});
  });
  it("should return 401 if customer is not logged in", async () => {
    const res = await request(server)
      .post("/api/returns")
      .send({ customerId, movieId });
    expect(res.status).toBe(401);
  });
  it("should return 400 if customerID is not provided", async () => {
    const res = await request(server).post("/api/returns").send(movieId);
    expect(res.status).toBe(400);
  });
});
