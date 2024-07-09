const ModelInventory = require("../../models/inventory");

module.exports = async function (_req, res, next) {
  try {
    const user = res.locals.user;

    const count = await ModelInventory.find({ userId: user._id }).count();

    return res.send({ count });
  } catch (error) {
    return next(error);
  }
};
