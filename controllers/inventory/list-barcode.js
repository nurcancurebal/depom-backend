const ModelInventory = require("../../models/inventory");

module.exports = async function (req, res, next) {
  try {
    const userId = res.locals.user._id;

    const barcode = req.params.barcode;

    let result = await ModelInventory.find({ userId, barcode });

    return res.send(result);
  } catch (error) {
    return next(error);
  }
};
