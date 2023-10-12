const router = require("express").Router();
const bcrypt = require("bcryptjs");
const db = require("../../data/dbConfig");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config/index");
const { validateUser, checkUserExists } = require("./auth-middleware");

router.post(
  "/register",

  validateUser,
  checkUserExists,
  async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const newUser = {
        username,
        password: bcrypt.hashSync(password, 5),
      };

      const id = await db("users").insert(newUser);

      const [result] = await db("users").where("id", id);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }

  }
);

router.post("/login", validateUser, (req, res, next) => {
  const { username, password } = req.body;
  try {
    db("users")
      .where("username", username)
      .first()
      .then((user) => {
        if (user && bcrypt.compareSync(password, user.password)) {
          const token = buildToken(user);
          res.status(200).json({ message: `welcome ${user.username}`, token });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      });
  } catch (err) {
    next(err);
  }

});

function buildToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };

  const options = {
    expiresIn: "1d",
  };

  return jwt.sign(payload, JWT_SECRET, options);
}

module.exports = router;