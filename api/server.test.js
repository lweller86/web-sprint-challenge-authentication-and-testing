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
// Write your tests here
it("sanity", () => {
  expect(true).toBe(true);
});

describe("Check [get]/api/jokes endpoint functioning correctly", () => {
  const user = {
    username: "larry",
    password: "1234",
  };

  it("receive No token message when token is missing", async () => {
    const data = await request(server).get("/api/jokes");
    console.log(data);
    expect(data.body).toMatchObject({
      message: "Token required",
    });
  });

  it("receive list of jokes with proper login and token", async () => {
    await request(server).post("/api/auth/register").send(user);
    const userRes = await request(server).post("/api/auth/login").send(user);
    const data = await request(server)
      .get("/api/jokes")
      .set("Authorization", `${userRes.body.token}`);
    expect(data.body).toHaveLength(3);
  });
});

describe("Check [Post]/api/auth/register endpoint functioning correctly", () => {
  it("missing username or password returns middleware", async () => {
    const noUsername = await request(server).post("/api/auth/register").send({
      username: "",
      password: "1234",
    });
    console.log(noUsername);
    expect(noUsername.body).toMatchObject({
      message: "username and password required",
    });
    const noPassword = await request(server).post("/api/auth/register").send({
      username: "logan",
      password: "",
    });
    expect(noPassword.body).toMatchObject({
      message: "username and password required",
    });
  });

  it("correct username returns object containing id,password,and username", async () => {
    const validUser = await request(server).post("/api/auth/register").send({
      username: "Aaron",
      password: "luoldeng9",
    });
    expect(validUser.body.username).toBe("Aaron");
    expect(validUser.body.id).toBe(1);
    expect(validUser.body.password).not.toBe("luoldeng9");
  });
});

describe("Check [Post]/api/auth/login endpoint functioning correctly", () => {
  it("logging in with a user that is not registered returns invalid credentials", async () => {
    const noUsername = await request(server).post("/api/auth/login").send({
      username: "larry",
      password: "1234",
    });

    expect(noUsername.body).toMatchObject({
      message: "Invalid credentials",
    });
  });

  it("logging in with proper credentials returns welcome message and token", async () => {
    await request(server).post("/api/auth/register").send({
      username: "Aaron",
      password: "luoldeng9",
    });

    const login = await request(server).post("/api/auth/login").send({
      username: "Aaron",
      password: "luoldeng9",
    });
    expect(login.body.message).toBe("welcome Aaron");
  });
});