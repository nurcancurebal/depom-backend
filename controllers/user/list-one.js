const ModelUser = require("../../models/user");

module.exports = async function (req, res, next) {

    try {

        const user = res.locals.user;

        const findUser = await ModelUser.findOne(user._id);

        if (!findUser) {
            throw new Error("Not found user!!!");
        };

        return res.send(findUser._doc)

    } catch (error) {

        return next(error);

    };

}