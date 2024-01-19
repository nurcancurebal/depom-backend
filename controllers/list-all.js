const ModelInventory = require("./../models/inventory");

module.exports = async function (req, res, next) {

    try {

        const inventory = res.locals.inventory;

        let result = await ModelInventory.find({ userId: user._id });

        result = Array.from(result).map(item => item._doc);

        return res.send(result);

    } catch (error) {

        return next(error);

    };
}