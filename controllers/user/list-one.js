const ModelUser = require("../../models/user");

module.exports = async function (_req, res, next) {
  try {
    const userId = res.locals.user._id;

    const findUser = await ModelUser.findOne(userId);

    if (!findUser) {
      throw new Error("Kullanıcı bulunamadı!!!");
    }

    return res.send(findUser._doc);
  } catch (error) {
    return next(error);
  }
};
