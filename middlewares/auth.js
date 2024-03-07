const jwt = require("jsonwebtoken");

const ModelUser = require("../models/user");

const { SECRET } = process.env;

module.exports = async function (req, res, next) {

    try {

        let token = req?.headers?.authorization;

        if (!token) throw new Error("Unauthorized!");

        token = token.split(" ");

        if (token.length != 2) throw new Error("Unauthorized!");

        token = token[1];

        if (!token) throw new Error("Unauthorized!");

        const checkToken = jwt.verify(token, SECRET);

        const id = checkToken.id;

        if (!id) throw new Error("Unauthorized!");

        let resultUser = await ModelUser.findById(id);

        if (!resultUser) throw new Error("Unauthorized!");

        resultUser = resultUser._doc;

        res.locals.user = resultUser;

        return next();

    } catch (error) {

        error.status = 401;
        return next(error);

    };

};