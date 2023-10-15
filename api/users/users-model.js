const db = require("../../data/dbConfig")

const getById = (id) => {
    return db("users").where("id", id).first();

};
const getBy = async (filter) => {
    return db("users").where(filter)
}

const add = async (user) => {
    const [id] = await db("users").insert(user)
    const newUser = getById(id)
    return newUser
};

module.exports = {
    add,
    getById,
    getBy

};