const ModelInventory = require("./../models/inventory");

module.exports = async function (req, res, next) {

    try {

        const body = req.body;

        let result = await ModelInventory.find({
            barcode: body.barcode,
        });

        result = Array.from(result).map(item => item._doc);

        return res.send(result);

    } catch (error) {

        return next(error);

    };
}