const jwt = require("jsonwebtoken");

const ModelUser = require("../../models/user");

const { SECRET } = process.env;

module.exports = async function (req, res, next) {

    try {

        const body = req.body;

        if (!body?.username) throw new Error("Username not found!");
        if (!body?.password) throw new Error("Password not found!");

        const resultUser = await ModelUser.findOne({ username: body.username });

        if (!resultUser) throw new Error("User not found!");

        if (body.password != resultUser.password) throw new Error("Unauthorized!");

        const token = jwt.sign({ id: resultUser._id.toString() }, SECRET);

        return res.send({ token });

    } catch (error) {

        error.status = 401;
        return next(error);

    };
};