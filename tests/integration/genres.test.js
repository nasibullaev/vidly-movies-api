const { Genre } = require("../../models/genre");
const request = require("supertest");
let server;

describe("api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    //await Genre.deleteMany({});
  });
  //   describe("GET /", () => {
  //     it("should return all genres", async () => {
  //       await Genre.collection.insertMany([
  //         { name: "genre1" },
  //         { name: "genre2" },
  //       ]);
  //       const res = await request(server).get("/api/genres");
  //       expect(res.status).toBe(200);
  //       expect(res.body.length).toBe(9);
  //       expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
  //       expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
  //     });
  //   });
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
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });
});
