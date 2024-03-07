const ModelUser = require("../../models/user");

module.exports = async function (req, res, next) {

    try {

        const body = req.body;

        if (!body?.username) throw new Error("Username not found!");
        if (!body?.password) throw new Error("Password not found!");
        if (!body?.firstname) throw new Error("Firstname not found!");
        if (!body?.lastname) throw new Error("Lastname not found!");
        if (!body?.birthdate) throw new Error("Birthdate not found!");

        const data = {
            username: body.username,
            password: body.password,
            firstname: body.firstname,
            lastname: body.lastname,
            birthdate: body.birthdate
        };

        await ModelUser.create(data);

        res.send();

    } catch (error) {

        error.status = 400;
        return next(error);

    };
};