const db = require('../../data/dbConfig')
const User = require('../users/users-model')

function validateUser (req, res, next) {
  const {username, password} = req.body
  if(!username || !password){
    res.status(400).json({message: "username and password required"})
  } else{
    next()
  }
}

async function userNameAvailable(req, res, next) {
    try {
        const users = await User.getBy({ username: req.body.username})
        if(!users.length){
            next()
        }else{
            res.status(400).json({message: "username taken"})
        }
    } catch(err) {
        next(err)
    }
}

module.exports = {
validateUser,
userNameAvailable,
};