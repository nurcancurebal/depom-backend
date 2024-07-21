const ModelInventory = require("../../models/inventory");

module.exports = async function (_req, res, next) {
  try {
    const user = res.locals.user;

    let result = await ModelInventory.aggregate([
      {
        $match: {
          userId: user._id,
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

    return res.send(...result);
  } catch (error) {
    return next(error);
  }
};
