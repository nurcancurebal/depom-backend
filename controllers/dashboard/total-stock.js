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
          data: { $push: "$$ROOT" },
        },
      },
      {
        $addFields: {
          entryData: {
            $filter: {
              input: "$data",
              as: "item",
              cond: { $eq: ["$$item.process", "entry"] },
            },
          },
          checkoutData: {
            $filter: {
              input: "$data",
              as: "item",
              cond: { $eq: ["$$item.process", "checkout"] },
            },
          },
        },
      },
      {
        $addFields: {
          stockQuantity: {
            $subtract: [
              { $sum: "$entryData.quantity" },
              { $sum: "$checkoutData.quantity" },
            ],
          },
        },
      },
      {
        $group: {
          _id: null, // Tüm belgeleri tek bir grup olarak toplar
          totalStockQuantity: { $sum: "$stockQuantity" },
        },
      },
      {
        $project: {
          _id: 0, // _id alanını gizle
          totalStockQuantity: 1,
        },
      },
    ]);

    return res.send(result.length > 0 ? result[0] : { totalStockQuantity: 0 });
  } catch (error) {
    return next(error);
  }
};
