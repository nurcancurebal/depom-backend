const ModelInventory = require("./../models/inventory");

module.exports = async function (req, res, next) {

    try {

        const barcode = req.params.barcode;

        await ModelInventory.deleteOne({ barcode });

        res.send();

    } catch (error) {

        return next(error);

    };

}