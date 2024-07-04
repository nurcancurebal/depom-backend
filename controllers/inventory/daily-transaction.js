const ModelInventory = require("../../models/inventory");

module.exports = async function (_req, res, next) {
    try {

        const user = res.locals.user;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        let result = await ModelInventory.aggregate([
            {
                $match: {
                    userId: user._id,
                    date: {
                        $gte: today, // Bugünden büyük veya eşit
                        $lt: tomorrow // Yarından küçük
                    }
                }
            },
            {
                $count: "total"
            }
        ]);

        return res.send(result.length > 0 ? result[0] : { total: 0 });

    } catch (error) {
        return next(error);
    }
};