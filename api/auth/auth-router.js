const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../../api/users/users-model');

router.post('/register', async (req, res) => {
    try {
        let user = req.body;

        if (!user.username || !user.password) {
            return res.status(400).json({ message: "username and password required" });
        }

        const existingUser = await Users.findBy({ username: user.username });
        if (existingUser) {
            return res.status(400).json({ message: "username taken" });
        }

        const hash = bcrypt.hashSync(user.password, 8);
        user.password = hash;

        const saved = await Users.add(user); 
        res.status(201).json(saved);

    } catch (error) {
        res.status(201).json(error);
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "username and password required" });
        }

        const user = await Users.findBy({ username });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: "invalid credentials" });
        }

        const token = generateToken(user);
        res.status(200).json({ message: `welcome, ${user.username}`, token });

    } catch (error) {
        res.status(200).json(error);
    }
});

function generateToken(user) {
    const payload = {
        userId: user.id,
        username: user.username,
    };
    const options = {
        expiresIn: '1h',  // Token expires in 1 hour.
    };
    return jwt.sign(payload, process.env.SECRET || "shh", options);
}

module.exports = router;