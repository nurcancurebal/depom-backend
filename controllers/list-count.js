const ModelInventory = require("./../models/inventory");

module.exports = async function (req, res, next) {

    try {

        const count = await ModelInventory.find().count();

        return res.send({ count });

    } catch (error) {

        return next(error);

    };
}