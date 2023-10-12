const db = require('../../data/dbConfig')

function validateUser (req, res, next) {
  const {username, password} = req.body
  if(!username || !password){
    res.status(400).json({message: "username and password required"})
  } else{
    next()
  }
}
async function checkUserExists(req, res, next) {
  const user = 
  await db("users")
  .where("username", 
  req.body.username)
  .first();

  if(user){
    res.status(400).jsn({message: "username taken"})
  } else{
    next()
  }

}

module.exports = {
validateUser,
checkUserExists,
};