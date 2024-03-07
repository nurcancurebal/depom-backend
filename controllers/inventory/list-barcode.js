const ModelInventory = require("../../models/inventory");

module.exports = async function (req, res, next) {

    try {

        const user = res.locals.user;

        const barcode = req.params.barcode;

        let result = await ModelInventory.find({ userId: user._id, barcode });

        return res.send(result);

    } catch (error) {

        return next(error);

    };
}