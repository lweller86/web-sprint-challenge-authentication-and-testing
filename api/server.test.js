const server = require("./server");
const request = require("supertest");
const db = require("../data/dbConfig");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db("users").truncate();
});


describe("Sanity Checks", () => {
  test('1st sanity', () => {
    expect(true).toBe(true)
  })

})
