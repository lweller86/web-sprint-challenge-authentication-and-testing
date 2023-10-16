const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../users/users-model")
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config/index");
const { validateUser, userNameAvailable } = require("./auth-middleware");
const db = require("../../data/dbConfig")

router.post("/register",
  validateUser,
  userNameAvailable,
  async (req, res, next) => {
    try {
      const { username, password } = req.body
      const hash = bcrypt.hashSync(password, 5)
      User.add({ username: username, password: hash })
        .then(created => {
          res.status(201).json(created)
        })


    } catch (err) {
      next(err);
    }

  }
);

router.post("/login", validateUser, async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "username and password required" });
  } else {
    const user = await db("users").where({ username }).first();
    if (!user) {
      return res.status(400).json({ message: "invalid credentials" });
    } else {
      if (bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign(
          { username },
          process.env.JWT_SECRET || "shh",
          { expiresIn: "7d" }
        );
        return res.status(200).json({ message: "welcome, " + username, token });
      } else {
        return res.status(400).json({ message: "invalid credentials" });
      }
    }
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