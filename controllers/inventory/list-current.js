const ModelInventory = require("../../models/inventory");

module.exports = async function (req, res, next) {
  try {
    const user = res.locals.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || "barcode";
    const skip = (page - 1) * limit;

    const sortName = sort.startsWith("-") ? sort.slice(1) : sort;

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
          productname: { $first: "$productname" },
          category: { $first: "$category" },
          subcategory: { $first: "$subcategory" },
          supplier: { $first: "$supplier" },
          brand: { $first: "$brand" },
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
          entryAverage: { $avg: "$entryData.unitprice" },
        },
      },
      {
        $addFields: {
          totalUnitPrice: "$entryAverage",
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
        $project: {
          _id: 1,
          productname: 1,
          category: 1,
          subcategory: 1,
          supplier: 1,
          brand: 1,
          stockQuantity: 1,
          totalUnitPrice: 1,
          profitLoss: 1,
          date: { $max: "$data.date" },
        },
      },
      { $sort: { [sortName]: sort.startsWith("-") ? -1 : 1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    return res.send(result);
  } catch (error) {
    return next(error);
  }
};
