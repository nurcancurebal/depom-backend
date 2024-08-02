const jwt = require("jsonwebtoken");

const ModelUser = require("../models/user");

const { SECRET_KEY } = process.env;

module.exports = async function (req, res, next) {
  try {
    let token = req?.headers?.authorization;

    if (!token) throw new Error("Token sağlanamadı!");

    token = token.split(" ");

    if (token.length != 2) throw new Error("Token sağlanamadı!");

    token = token[1];

    if (!token) throw new Error("Token sağlanamadı!");

    const checkToken = jwt.verify(token, SECRET_KEY);

    const id = checkToken.id;

    if (!id) throw new Error("Yetkisiz!");

    let resultUser = await ModelUser.findById(id);

    if (!resultUser) throw new Error("Yetkisiz!");

    resultUser = resultUser._doc;

    res.locals.user = resultUser;

    return next();
  } catch (error) {
    error.status = 401;
    return next(error);
  }
};
