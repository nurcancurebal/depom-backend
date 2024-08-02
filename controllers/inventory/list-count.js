const ModelInventory = require("../../models/inventory");

module.exports = async function (_req, res, next) {
  try {
    const userId = res.locals.user._id;

    const count = await ModelInventory.find({ userId }).count();

    return res.send({ count });
  } catch (error) {
    return next(error);
  }
};
