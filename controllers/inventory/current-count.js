const ModelInventory = require("../../models/inventory");

module.exports = async function (_req, res, next) {
  try {
    const userId = res.locals.user._id;

    let result = await ModelInventory.aggregate([
      {
        $match: {
          userId,
        },
      },
      {
        $group: {
          _id: { barcode: "$barcode", unit: "$unit" },
        },
      },
      { $count: "count" },
    ]);

    return res.send(result[0]);
  } catch (error) {
    return next(error);
  }
};
