const ModelInventory = require("./../models/inventory");

module.exports = async function (req, res, next) {

    try {

        const barcode = req.params.barcode;

        let result = await ModelInventory.findOne({ barcode });

        return res.send(result);

    } catch (error) {

        return next(error);

    };
}