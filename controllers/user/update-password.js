const md5 = require('md5');

const ModelUser = require("../../models/user");

module.exports = async function (req, res, next) {

    try {

        const user = res.locals.user;
        const body = req.body;

        const oldPassword = md5(body.oldPassword);

        if (oldPassword !== user.password) throw new Error("Old password is incorrect!");

        const newPassword = md5(body.newPassword);

        const updatedUser = await ModelUser.findByIdAndUpdate(user._id, { password: newPassword });

        if (!updatedUser) throw new Error("Not found user!!!");

        res.send();

    } catch (error) {

        return next(error);

    };
}