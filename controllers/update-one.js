const ModelInventory = require("./../models/inventory");

module.exports = async function (req, res, next) {

    try {

        const barcode = req.params.barcode;
        const body = req.body;

        const findOneInventory = await ModelInventory.updateOne({ barcode }, body);

        if (!findOneInventory) {
            throw new Error("Not found inventory!!!");
        };

        res.send();

    } catch (error) {

        return next(error);

    };
}