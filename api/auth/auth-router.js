const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../users/users-model")
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config/index");
const { validateUser, userNameAvailable } = require("./auth-middleware");

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
  const { username } = req.body;
  const [ user ] = await User.getBy({ username })
  if (bcrypt.compareSync(req.body.password, user.password)) {
    const token = buildToken(user);
    res.status(200).json({ message: `welcome ${username}`, token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
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