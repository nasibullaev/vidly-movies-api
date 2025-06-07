const request = require("supertest");
const { Rental } = require("../../models/rental");
const { User } = require("../../models/user");
const mongoose = require("mongoose");
const { result } = require("lodash");
describe("api/returns", () => {
  let server;
  let rental, customerId, movieId, token;
  const exec = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };
  beforeEach(async () => {
    customerId = new mongoose.Types.ObjectId();
    movieId = new mongoose.Types.ObjectId();
    token = new User().generateAuthToken();
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
  beforeAll(async () => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
    await Rental.deleteMany({});
  });
  it("should return 401 if customer is not logged in", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });
  it("should return 400 if customerID is not provided", async () => {
    customerId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });
  it("should return 400 if movieID is not provided", async () => {
    movieId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });
  it("should return 404 if no rental found for this customer/movie", async () => {
    await Rental.deleteMany({});
    const res = await exec();
    expect(res.status).toBe(404);
  });
  it("should return 400 if return is already processed", async () => {
    rental.dateReturned = new Date();
    await rental.save();
    const res = await exec();
    expect(res.status).toBe(400);
  });
});
