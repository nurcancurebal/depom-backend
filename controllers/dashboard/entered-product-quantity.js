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
          _id: null,
          entryTotalQuantity: {
            $sum: {
              $cond: [{ $eq: ["$process", "entry"] }, "$quantity", 0],
            },
          },
          checkoutTotalQuantity: {
            $sum: {
              $cond: [{ $eq: ["$process", "checkout"] }, "$quantity", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          entryTotalQuantity: 1,
          checkoutTotalQuantity: 1,
        },
      },
    ]);

    if (result.length === 0) {
      result = [{ entryTotalQuantity: 0, checkoutTotalQuantity: 0 }];
    }

    return res.send(...result);
  } catch (error) {
    return next(error);
  }
};
