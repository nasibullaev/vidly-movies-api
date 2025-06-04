const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");
const request = require("supertest");
const mongoose = require("mongoose");
let server;

describe("api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
    await Genre.deleteMany({});
  });
  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);
      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });
  describe("GET /:id", () => {
    it("should return the specific genre from the given id", async () => {
      //   const id = "683dc9f3627a66382cb3b1fc";
      //   const res = await request(server).get(`/api/genres/${id}`);
      //   expect(res.status).toBe(200);
      //   expect(res.body).toHaveProperty("name", "Comedy");
      //   console.log(res);

      const genre = new Genre({ name: "genre1" });
      await genre.save();
      const res = await request(server).get("/api/genres/" + genre._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });
    it("should return 404 if invalid id is given", async () => {
      const res = await request(server).get("/api/genres/1");
      expect(res.status).toBe(404);
    });
    it("should return 404 if no genre with the given valid id exists", async () => {
      const id = new mongoose.Types.ObjectId(); // valid but non-existing
      const res = await request(server).get("/api/genres/" + id);
      expect(res.status).toBe(404);
    });
  });
  describe("POST /", () => {
    // define the hapy path, and then in each test we change one paramtere that clearly aligns with the name of the test.
    let token, name;
    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name });
    };
    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "genre1";
    });
    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });
    it("should return 400 if genre is less than 5 characters", async () => {
      name = "1234";
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("should return 400 if genre is more than 50 characters", async () => {
      name = "a".repeat(51);
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("should save the genre if input is valid", async () => {
      const res = await exec();
      const genre = await Genre.findOne({ name: "genre1" });
      expect(res.status).toBe(200);
      expect(genre).not.toBeNull();
    });
    it("should return the genre if input is valid", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });
});
