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
          entryAverage: { $avg: "$entryData.unitprice" },
          quantityUnitprice: {
            $reduce: {
              input: "$entryData",
              initialValue: 0,
              in: {
                $add: [
                  "$$value",
                  { $multiply: ["$$this.quantity", "$$this.unitprice"] },
                ],
              },
            },
          },
        },
      },
      {
        $addFields: {
          profitLoss: {
            $cond: [
              { $eq: [{ $size: "$checkoutData" }, 0] },
              "-",
              {
                $sum: {
                  $map: {
                    input: "$checkoutData",
                    as: "item",
                    in: {
                      $multiply: [
                        { $subtract: ["$$item.unitprice", "$entryAverage"] },
                        "$$item.quantity",
                      ],
                    },
                  },
                },
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalProfitLoss: {
            $sum: {
              $cond: [{ $eq: ["$profitLoss", "-"] }, 0, "$profitLoss"],
            },
          },
          totalQuantityUnitprice: { $sum: "$quantityUnitprice" },
        },
      },
      {
        $project: {
          totalProfitLoss: 1,
          percentageProfitloss: {
            $cond: [
              { $eq: ["$totalQuantityUnitprice", 0] },
              "Sıfıra bölünemez",
              {
                $divide: [
                  {
                    $multiply: ["$totalProfitLoss", 100],
                  },
                  "$totalQuantityUnitprice",
                ],
              },
            ],
          },
        },
      },
    ]);

    return res.send(
      result.length > 0
        ? result[0]
        : { totalProfitLoss: 0, percentageProfitloss: 0 }
    );
  } catch (error) {
    return next(error);
  }
};
