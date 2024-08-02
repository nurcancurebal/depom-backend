const ModelInventory = require("../../models/inventory");

module.exports = async function (_req, res, next) {
  try {
    const userId = res.locals.user._id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let result = await ModelInventory.aggregate([
      {
        $match: {
          userId,
          date: {
            $gte: today, // Bugünden büyük veya eşit
            $lt: tomorrow, // Yarından küçük
          },
        },
      },
      {
        $count: "total",
      },
    ]);

    return res.send(result.length > 0 ? result[0] : { total: 0 });
  } catch (error) {
    return next(error);
  }
};
