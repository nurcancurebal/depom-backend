const ModelInventory = require("../../models/inventory");

module.exports = async function (_req, res, next) {
    try {

        const user = res.locals.user;

        let result = await ModelInventory.aggregate([
            {
                $match: {
                    userId: user._id
                }
            },
            {
                $group: {
                    _id: { barcode: "$barcode", unit: "$unit" },
                }
            },
            { $count: "count" },
        ]);

        return res.send(result[0]);
    } catch (error) {
        return next(error);
    }
};