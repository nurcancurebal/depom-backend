const ModelInventory = require("../../models/inventory");

module.exports = async function (_req, res, next) {
  try {
    const dateData = [];

    const currentYear = new Date().getFullYear();

    for (let month = 0; month < 12; month++) {
      const startDate = new Date(Date.UTC(currentYear, month, 1));
      const endDate = new Date(Date.UTC(currentYear, month + 1, 0));

      const startISO = startDate.toISOString();
      const endISO = endDate.toISOString();

      dateData.push({
        startDate: startISO,
        endDate: endISO,
        data: null,
      });
    }

    const userId = res.locals.user._id;

    for (const dateRange of dateData) {
      let result = await ModelInventory.aggregate([
        {
          $match: {
            userId,
            date: {
              $gte: new Date(dateRange.startDate),
              $lte: new Date(dateRange.endDate),
            },
          },
        },
        {
          $group: {
            _id: null,
            entryData: {
              $push: {
                $cond: [{ $eq: ["$process", "entry"] }, "$$ROOT", null],
              },
            },
            checkoutData: {
              $push: {
                $cond: [{ $eq: ["$process", "checkout"] }, "$$ROOT", null],
              },
            },
          },
        },
        {
          $project: {
            moneyEarned: {
              $sum: {
                $map: {
                  input: "$checkoutData",
                  as: "item",
                  in: { $multiply: ["$$item.quantity", "$$item.unitprice"] },
                },
              },
            },
            moneySpent: {
              $sum: {
                $map: {
                  input: "$entryData",
                  as: "item",
                  in: { $multiply: ["$$item.quantity", "$$item.unitprice"] },
                },
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            monthlyNetProfitLoss: {
              $cond: [
                { $eq: ["$moneyEarned", 0] },
                0,
                {
                  $multiply: [
                    {
                      $divide: [
                        { $subtract: ["$moneyEarned", "$moneySpent"] },
                        "$moneyEarned",
                      ],
                    },
                    100,
                  ],
                },
              ],
            },
          },
        },
      ]);

      let calculatedProfitLoss =
        result.length > 0 ? result[0].monthlyNetProfitLoss : 0;

      dateRange.data = Math.round(calculatedProfitLoss).toString().slice(0, 3);
    }

    const finalDateData = dateData.map(({ data }) => data);

    return res.send(finalDateData);
  } catch (error) {
    return next(error);
  }
};
