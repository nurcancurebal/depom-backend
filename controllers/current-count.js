const ModelInventory = require("./../models/inventory");

module.exports = async function (req, res, next) {
    try {

        let result = await ModelInventory.aggregate([
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