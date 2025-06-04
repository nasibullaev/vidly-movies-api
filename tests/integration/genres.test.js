const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");
const request = require("supertest");
let server;

describe("api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
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
  });
  describe("POST /", () => {
    it("should return 401 if client is not logged in", async () => {
      const res = await request(server).post("/api/genres").send({
        name: "genre1",
      });
      expect(res.status).toBe(401);
    });
    it("should return 400 if genre is less than 5 characters", async () => {
      const token = new User().generateAuthToken();
      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({
          name: "123",
        });
      expect(res.status).toBe(400);
    });
    it("should return 400 if genre is more than 50 characters", async () => {
      const token = new User().generateAuthToken();
      const longName = new Array(52).join("a");
      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({
          name: longName,
        });
      expect(res.status).toBe(400);
    });
    it("should save the the genre if input is valid", async () => {
      const token = new User().generateAuthToken();
      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({
          name: "genre1",
        });
      const genre = await Genre.find({ name: "genre1" });
      expect(res.status).toBe(200);
      expect(genre).not.toBeNull();
    });
  });
});
