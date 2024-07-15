const { SECRET_KEY } = process.env;

const jwt = require("jsonwebtoken");
const md5 = require("md5");

const ModelUser = require("../../models/user");

module.exports = async function (req, res, next) {
  try {
    const body = req.body;

    if (!body?.username) throw new Error("Username not found!");
    if (!body?.password) throw new Error("Password not found!");

    const resultUser = await ModelUser.findOne({ username: body.username });

    if (!resultUser) throw new Error("User not found!");

    const hashedPassword = md5(body.password);

    if (hashedPassword != resultUser.password) throw new Error("Unauthorized!");

    const token = jwt.sign({ id: resultUser._id.toString() }, SECRET_KEY);

    return res.send({ token });
  } catch (error) {
    error.status = 401;
    return next(error);
  }
};
