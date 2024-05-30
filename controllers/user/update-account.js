const ModelUser = require("../../models/user");

module.exports = async function (req, res, next) {

    try {

        const user = res.locals.user;
        const body = req.body;

        delete body.password;

        const data = {
            username: body.username,
            firstname: body.firstname,
            lastname: body.lastname,
            birthdate: body.birthdate
        };

        const findUser = await ModelUser.findByIdAndUpdate(user._id, data);

        if (!findUser) {
            throw new Error("Not found user!!!");
        };

        res.send();

    } catch (error) {

        return next(error);

    };
}